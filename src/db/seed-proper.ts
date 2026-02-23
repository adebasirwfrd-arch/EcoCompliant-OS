import { db } from "./index";
import * as schema from "./schema";
import { v4 as uuidv4 } from "uuid";

async function seedProper() {
    console.log("Seeding PROPER audit data...");

    // Assessment ID for 2025 (GOLD Prediction)
    const id2025 = uuidv4();
    await db.insert(schema.properAssessments).values({
        id: id2025,
        year: 2025,
        status: "Verified",
        predictedRating: "GOLD",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await db.insert(schema.properInventory).values({
        id: uuidv4(),
        assessmentId: id2025,
        waterQualityScore: 95,
        airQualityScore: 98,
        hazardousWasteScore: 100,
        landQualityScore: 92,
        complianceLevel: "Full",
    });

    await db.insert(schema.properBeyondCompliance).values({
        id: uuidv4(),
        assessmentId: id2025,
        energyEfficiencyScore: 88,
        waterConservationScore: 82,
        biodiversityScore: 85,
        emissionReductionScore: 90,
        socialInnovationScore: 95,
    });

    // Criteria for 2025
    const criteria2025 = [
        { category: "Water", parameter: "POPAL Certification & BMAL Compliance", fulfillment: "Yes", score: 100 },
        { category: "Air", parameter: "CEMS Integration & SIMPEL Data Accuracy", fulfillment: "Yes", score: 100 },
        { category: "B3 Waste", parameter: "Festronik Managed accurately", fulfillment: "Yes", score: 100 },
        { category: "Energy", parameter: "Renewable Energy Mix (Solar PV Installation)", fulfillment: "Yes", score: 85 },
        { category: "Biodiversity", parameter: "Mangrove Restoration Program", fulfillment: "Yes", score: 90 },
        { category: "Global Warming", parameter: "GHG Absolute Reduction (Scope 1 & 2)", fulfillment: "Yes", score: 92 },
    ];

    for (const c of criteria2025) {
        await db.insert(schema.properCriteriaResults).values({
            id: uuidv4(),
            assessmentId: id2025,
            category: c.category as any,
            parameter: c.parameter,
            fulfillment: c.fulfillment as any,
            score: c.score,
            updatedAt: new Date(),
        });
    }

    // Community Programs for 2025
    await db.insert(schema.properCommunityDev).values({
        id: uuidv4(),
        assessmentId: id2025,
        programName: "Digital Village Empowerment",
        budget: 750000000,
        beneficiaries: 1200,
        sroiScore: 4.2,
        innovationType: "Social",
        status: "Completed",
        updatedAt: new Date(),
    });

    // Assessment ID for 2026 (GREEN Prediction)
    const id2026 = uuidv4();
    await db.insert(schema.properAssessments).values({
        id: id2026,
        year: 2026,
        status: "Draft",
        predictedRating: "GREEN",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    await db.insert(schema.properInventory).values({
        id: uuidv4(),
        assessmentId: id2026,
        waterQualityScore: 90,
        airQualityScore: 92,
        hazardousWasteScore: 88,
        landQualityScore: 85,
        complianceLevel: "Full",
    });

    await db.insert(schema.properBeyondCompliance).values({
        id: uuidv4(),
        assessmentId: id2026,
        energyEfficiencyScore: 65,
        waterConservationScore: 55,
        biodiversityScore: 40,
        emissionReductionScore: 60,
        socialInnovationScore: 70,
    });

    // Criteria for 2026
    const criteria2026 = [
        { category: "Water", parameter: "Wastewater Monitoring", fulfillment: "Yes", score: 90 },
        { category: "Air", parameter: "Stack Emission Quality", fulfillment: "Yes", score: 95 },
        { category: "Energy", parameter: "Energy Audit H2", fulfillment: "Yes", score: 65 },
        { category: "Biodiversity", parameter: "Local Species Cataloging", fulfillment: "No", score: 40 },
    ];

    for (const c of criteria2026) {
        await db.insert(schema.properCriteriaResults).values({
            id: uuidv4(),
            assessmentId: id2026,
            category: c.category as any,
            parameter: c.parameter,
            fulfillment: c.fulfillment as any,
            score: c.score,
            updatedAt: new Date(),
        });
    }

    console.log("PROPER seeding completed!");
}

seedProper().catch((e) => {
    console.error(e);
    process.exit(1);
});
