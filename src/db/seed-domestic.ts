import { db } from "./index";
import * as schema from "./schema";
import { v4 as uuidv4 } from "uuid";
import { subMonths, subDays, startOfMonth } from "date-fns";

async function seedDomestic() {
    console.log("Seeding domestic waste data...");

    // 0. Clear existing data
    await db.delete(schema.domesticWasteLogs);
    await db.delete(schema.wastePartners);
    await db.delete(schema.wasteSources);

    // 1. Create Sources
    const officeId = uuidv4();
    const productionId = uuidv4();
    const canteenId = uuidv4();
    const workshopId = uuidv4();

    await db.insert(schema.wasteSources).values([
        { id: officeId, name: "Office", location: "Administration Building", status: "Active" },
        { id: productionId, name: "Production", location: "Main Plant", status: "Active" },
        { id: canteenId, name: "Canteen", location: "Employee Hall", status: "Active" },
        { id: workshopId, name: "Workshop", location: "Maintenance Area", status: "Active" },
    ]);

    // 2. Create Partners
    const recyclerId = uuidv4();
    const tps3rId = uuidv4();
    const landfillId = uuidv4();

    await db.insert(schema.wastePartners).values([
        {
            id: recyclerId,
            name: "PT. Daur Ulang Mandiri",
            type: "Recycler",
            licenseNumber: "LIC-RW-2024-001",
            address: "Kawasan Industri Hijau, Blok C",
            contactPerson: "Bpk. Bambang",
            phone: "0812-3456-7890",
            vehiclePlate: "B 1234 ABC",
            status: "Active",
        },
        {
            id: tps3rId,
            name: "TPS3R Desa Bersemi",
            type: "TPS3R",
            licenseNumber: "LIC-TP-2024-042",
            address: "Jl. Melati No. 5",
            contactPerson: "Ibu Siti",
            phone: "0856-7890-1234",
            vehiclePlate: "B 5678 DEF",
            status: "Active",
        },
        {
            id: landfillId,
            name: "TPA Regional Integrated",
            type: "Landfill",
            licenseNumber: "LIC-LF-2024-999",
            address: "Jl. Raya TPA km 12",
            contactPerson: "Bpk. Jatmiko",
            phone: "021-555-1234",
            vehiclePlate: "B 9012 GHI",
            status: "Active",
        }
    ]);

    // 3. Generation Logs for the last 6 months
    const categories: ("Organik" | "Anorganik (Plastik)" | "Anorganik (Kertas)" | "Anorganik (Logam/Kaca)" | "Residu")[] =
        ["Organik", "Anorganik (Plastik)", "Anorganik (Kertas)", "Anorganik (Logam/Kaca)", "Residu"];
    const sources = [officeId, productionId, canteenId, workshopId];

    const now = new Date();
    const logs = [];

    for (let i = 0; i < 60; i++) {
        const date = subDays(now, i);
        const sourceId = sources[Math.floor(Math.random() * sources.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];

        // Randomly choose between kg and m3
        const isVolume = Math.random() > 0.8;
        const unit = (isVolume ? "m3" : "kg") as "kg" | "m3";
        const weight = isVolume ? null : Math.floor(Math.random() * 50) + 5;
        const volume = isVolume ? Math.random() * 2 + 0.5 : null;

        let destinationId;
        let status: "Processed" | "Transported" | "Stored" = "Processed";
        let vehiclePlate = "B " + (Math.floor(Math.random() * 9000) + 1000) + " XYZ";

        if (category === "Organik") {
            destinationId = tps3rId;
        } else if (category === "Residu") {
            destinationId = landfillId;
            status = "Transported";
        } else {
            destinationId = recyclerId;
        }

        logs.push({
            id: uuidv4(),
            date,
            category,
            sourceId,
            weight,
            volume,
            unit,
            vehiclePlate,
            destinationId,
            status,
            notes: "Routine daily collection",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await db.insert(schema.domesticWasteLogs).values(logs);

    console.log("Domestic waste seeding completed!");
}

seedDomestic().catch((e) => {
    console.error(e);
    process.exit(1);
});
