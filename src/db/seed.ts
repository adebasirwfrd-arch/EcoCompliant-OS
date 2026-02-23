import { db } from "./index";
import * as schema from "./schema";
import {
    COMPLIANCE_DATA,
    WASTE_DATA,
    WATER_QUALITY_LOGS,
    AMDAL_MILESTONES,
    ISO_AUDITS,
} from "../lib/fixtures";
import { GHG_SEED_DATA } from "./ghg-seed";
import { subMonths } from "date-fns";

async function seed() {
    console.log("Seeding database...");

    // Clear GHG and Waste to allow re-seeding specifically for this demo
    await db.delete(schema.ghgEmissions);
    await db.delete(schema.wasteManifests);

    // Seed Compliance Reports
    for (const item of COMPLIANCE_DATA) {
        await db.insert(schema.complianceReports).values({
            id: item.id,
            title: item.title,
            agency: item.agency,
            status: item.status as any,
            dueDate: new Date(item.dueDate),
        }).onConflictDoNothing();
    }

    // Seed Waste Manifests
    for (const item of WASTE_DATA) {
        await db.insert(schema.wasteManifests).values({
            id: item.id,
            manifestNumber: (item as any).manifest || `MNF-B3-${item.id}`,
            festronikId: item.status === "Transported" ? `FES-${item.id}-${Math.floor(Math.random() * 1000)}` : null,
            wasteType: item.type,
            wasteCode: item.code,
            wasteCategory: item.category as any,
            weight: item.weight,
            unit: item.unit as any,
            generatorDate: subMonths(new Date(), Math.floor(Math.random() * 3)), // Distributed dates
            maxStorageDays: item.category === "1" ? 180 : 365,
            status: item.status.toLowerCase() as any,
            transporterName: item.status === "Transported" ? "PT. Trans Limbah Nusantara" : null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).onConflictDoNothing();
    }

    // Seed Water Quality Logs
    for (const item of WATER_QUALITY_LOGS) {
        const id = Math.random().toString(36).substring(7);
        await db.insert(schema.waterQualityLogs).values({
            id: id,
            locationId: "IPL-01",
            parameter: "pH",
            value: item.ph,
            unit: "pH",
            timestamp: new Date(item.timestamp),
            isViolation: item.status === "Warning",
        }).onConflictDoNothing();
    }

    // Seed AMDAL Milestones
    for (const item of AMDAL_MILESTONES) {
        await db.insert(schema.amdalMilestones).values({
            id: item.id,
            title: item.title,
            status: item.status as any,
            progress: item.progress,
        }).onConflictDoNothing();
    }

    // Seed ISO Audits
    for (const item of ISO_AUDITS) {
        await db.insert(schema.isoAudits).values({
            id: item.id,
            auditType: item.type,
            auditDate: new Date(item.date),
            findingsCount: item.findings,
            status: item.status as any,
        }).onConflictDoNothing();
    }

    // Seed GHG Emissions
    for (const item of GHG_SEED_DATA) {
        await db.insert(schema.ghgEmissions).values(item).onConflictDoNothing();
    }

    console.log("Seeding completed!");
}

seed().catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
    process.exit(1);
});
