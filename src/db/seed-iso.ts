import { db } from "./index";
import {
    isoAspects,
    isoLegalRegistry,
    isoObjectives,
    isoCAPA,
    isoInterestedParties,
    isoOperationalControls,
    isoEmergencyPrep,
    isoPerformanceMonitoring,
    isoInternalAudits,
    isoManagementReviews,
    isoRisks
} from "./schema";
import { v4 as uuidv4 } from "uuid";

async function seedISO() {
    console.log("🌱 Seeding Super God-Tier ISO 14001 Data...");

    // 1. CLEAR EXISTING
    await db.delete(isoAspects);
    await db.delete(isoLegalRegistry);
    await db.delete(isoInterestedParties);
    await db.delete(isoOperationalControls);
    await db.delete(isoEmergencyPrep);
    await db.delete(isoPerformanceMonitoring);
    await db.delete(isoInternalAudits);
    await db.delete(isoManagementReviews);
    await db.delete(isoObjectives);
    await db.delete(isoCAPA);
    await db.delete(isoRisks);

    // 2. STAKEHOLDERS (Cl. 4.2)
    await db.insert(isoInterestedParties).values([
        { id: uuidv4(), party: "Environmental Agency (DLH)", needs: "Compliance with emissions permits", expectations: "Zero boundary noise exceedance", isLegalObligation: true, updatedAt: new Date() },
        { id: uuidv4(), party: "Local Community", needs: "Odor and noise control", expectations: "Support for local green initiatives", isLegalObligation: false, updatedAt: new Date() },
        { id: uuidv4(), party: "Investors (ESG Board)", needs: "Carbon footprint reduction", expectations: "Alignment with TCFD disclosure", isLegalObligation: true, updatedAt: new Date() },
    ]);

    // 3. ASPECTS & IMPACTS (Cl. 6.1.2)
    const aspects = [
        { id: uuidv4(), activity: "Chemical Storage", aspect: "Hazardous Spillage", impact: "Groundwater Contamination", severity: 5, probability: 3, controlMeasures: "Secondary bunding, spill kits" },
        { id: uuidv4(), activity: "Generator Operation", aspect: "Diesel Consumption", impact: "Natural Resource Depletion", severity: 3, probability: 5, controlMeasures: "Maintenance schedule" },
        { id: uuidv4(), activity: "Painting Line", aspect: "VOC Emissions", impact: "Air Quality Degradation", severity: 4, probability: 4, controlMeasures: "Scrubber maintenance" },
    ];
    for (const a of aspects) {
        const score = a.severity * a.probability;
        await db.insert(isoAspects).values({
            ...a,
            condition: "Normal",
            significanceScore: score,
            isSignificant: score >= 12,
            status: "Active",
            updatedAt: new Date()
        });
    }

    // 4. LEGAL REGISTRY (Cl. 6.1.3)
    await db.insert(isoLegalRegistry).values([
        { id: uuidv4(), regulationName: "PP No. 22 Tahun 2021", clause: "Lampiran VI", summary: "Baku Mutu Emisi", relevance: "Stack emissions", complianceStatus: "Compliant" },
        { id: uuidv4(), regulationName: "Permen LHK No. 6 Tahun 2021", clause: "Pasal 3", summary: "Pengelolaan Limbah B3", relevance: "Hazardous waste storage", complianceStatus: "Compliant" },
    ]);

    // 5. OBJECTIVES (Cl. 6.2)
    await db.insert(isoObjectives).values([
        { id: uuidv4(), objective: "Reduce Energy Intensity", targetValue: "10 kWh/unit", indicator: "kWh/unit", progress: 65, deadline: new Date("2026-12-31"), department: "Operations", status: "On Track" },
        { id: uuidv4(), objective: "Zero Environmental Incidents", targetValue: "0", indicator: "Number of incidents", progress: 100, deadline: new Date("2026-12-31"), department: "HSE", status: "Achieved" },
    ]);

    // 6. OPERATIONAL CONTROLS (Cl. 8.1)
    await db.insert(isoOperationalControls).values([
        { id: uuidv4(), procedureName: "OCP-ENV-01: Waste Segregation", department: "Operations", controlMethod: "Administrative", frequency: "Daily", pic: "HSE Officer", updatedAt: new Date() },
        { id: uuidv4(), procedureName: "OCP-ENV-04: Spill Response", department: "Logistics", controlMethod: "Engineering", frequency: "Weekly", pic: "Warehouse Spv", updatedAt: new Date() },
    ]);

    // 7. EMERGENCY PREP (Cl. 8.2)
    await db.insert(isoEmergencyPrep).values([
        { id: uuidv4(), scenario: "Major Chemical Spill", responsePlan: "Evacuation & Containment", equipmentRequired: "Spill Kits, SCBA", lastDrillDate: new Date("2025-08-10"), nextDrillDate: new Date("2026-02-15"), status: "Ready", updatedAt: new Date() },
    ]);

    // 8. PERFORMANCE MONITORING (Cl. 9.1)
    await db.insert(isoPerformanceMonitoring).values([
        { id: uuidv4(), indicatorName: "Water Reuse Rate", parameter: "Volume", unit: "%", baselineValue: 15, targetValue: 30, currentValue: 22, frequency: "Monthly", status: "On Track", updatedAt: new Date() },
    ]);

    // 9. INTERNAL AUDITS (Cl. 9.2)
    await db.insert(isoInternalAudits).values([
        { id: uuidv4(), auditTitle: "H1 2026 Partial EMS Audit", auditDate: new Date("2026-06-20"), auditorName: "Internal Team", majorNC: 0, minorNC: 1, ofi: 3, status: "Planned", updatedAt: new Date() },
        { id: uuidv4(), auditTitle: "2025 Full EMS Audit", auditDate: new Date("2025-12-05"), auditorName: "Lead Auditor", majorNC: 0, minorNC: 2, ofi: 5, status: "Completed", updatedAt: new Date() },
    ]);

    // 10. RISKS & OPPORTUNITIES (Cl. 6.1.1)
    await db.insert(isoRisks).values([
        { id: uuidv4(), source: "Climate Change", description: "Increased flood risk to site", riskLevel: "High", status: "Open" },
    ]);

    // 11. CAPA (Cl. 10.2)
    await db.insert(isoCAPA).values([
        { id: uuidv4(), source: "Internal Audit", description: "Waste manifest missing sign-off", ncType: "Minor", rootCause: "Process oversight", correctiveAction: "Digital sign-off tool", dueDate: new Date("2026-03-20"), status: "Verified" },
    ]);

    console.log("✅ ISO 14001 Seeding Complete!");
}

seedISO().catch(err => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
