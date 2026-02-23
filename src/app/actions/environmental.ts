"use server"

import { db } from "@/db"
import {
    wasteManifests,
    complianceReports,
    ghgEmissions,
    amdalMilestones,
    isoAudits,
    complianceComments,
    rkabSubmissions,
    properAssessments,
    properInventory,
    properBeyondCompliance,
    amdalRequirements,
    simpelRecords,
    popalProfiles,
    wastewaterLogs
} from "@/db/schema"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "./audit"
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache"

// --- Types ---

export type WasteManifestInput = {
    id?: string;
    manifestNumber?: string | null;
    festronikId?: string | null;
    wasteCode: string;
    wasteCategory: "1" | "2";
    wasteType: string;
    weight: string | number;
    unit?: string;
    generatorDate: string | Date;
    maxStorageDays: number;
    transporterName?: string | null;
    transporterLicense?: string | null;
    vehiclePlate?: string | null;
    destinationFacility?: string | null;
    handlingMethod?: "Recycle" | "Recovery" | "Incineration" | "Landfill" | "Export" | "Other" | null;
    managerEmail?: string | null;
    status?: "stored" | "transported" | "processed";
    notes?: string | null;
    fileUrl?: string | null;
};

export type AmdalRequirementInput = {
    id?: string;
    documentType: "AMDAL" | "UKL-UPL" | "SPPL" | "DELH";
    parameter: string;
    type: "RKL" | "RPL";
    frequency: "Daily" | "Monthly" | "Quarterly" | "Semester" | "Annual";
    lastMonitoredDate?: string | Date | null;
    nextDueDate: string | Date;
    status: "Compliant" | "Non-Compliant" | "Pending";
    pic?: string | null;
};

export type ComplianceReportInput = {
    id?: string;
    title: string;
    agency: string;
    category?: "RKAB" | "SIMPEL" | "RKL-RPL" | "UKL-UPL" | "Other";
    periodYear?: number | string;
    periodValue?: string;
    priority?: "Low" | "Medium" | "High" | "Urgent";
    status?: "Pending" | "Submitted" | "Approved" | "Rejected";
    dueDate: string | Date;
    submissionDate?: string | Date | null;
    description?: string | null;
    remarks?: string | null;
    attachmentUrl?: string | null;
    managerEmail?: string | null;
    assignedTo?: string | null;
};

export type PopalProfileInput = {
    id?: string;
    name: string;
    certificationNumber: string;
    certifiedBy?: string;
    validityStart: string | Date;
    validityEnd: string | Date;
    status?: "active" | "expired" | "revoked";
    companyId?: string | null;
    profileImageUrl?: string | null;
};

export type WastewaterLogInput = {
    id?: string;
    logDate: string | Date;
    phLevel: string | number;
    codLevel: string | number;
    bodLevel: string | number;
    tssLevel: string | number;
    ammoniaLevel: string | number;
    debitOutfall: string | number;
    popalId?: string | null;
    notes?: string | null;
    isViolation?: boolean;
};

export type AmdalMilestoneInput = {
    id?: string;
    title: string;
    status?: "Pending" | "In Progress" | "Completed";
    progress?: string | number;
    description?: string | null;
};

export type ISOAuditInput = {
    id?: string;
    auditType: string;
    auditDate: string | Date;
    findingsCount?: string | number;
    status?: "Scheduled" | "In Progress" | "Closed";
};

// --- GHG Emissions (Phase 4) ---
export type GhgEmissionInput = {
    id?: string;
    date: string | Date;
    scope: number;
    category: string;
    source: string;
    value: number;
    unit: string;
    emissionFactor: number;
    notes?: string | null;
    evidenceUrl?: string | null;
};

// --- Waste Manifests ---
export async function upsertWasteManifest(data: WasteManifestInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload: any = {
        manifestNumber: data.manifestNumber || null,
        festronikId: data.festronikId || null,
        wasteCode: data.wasteCode,
        wasteCategory: data.wasteCategory,
        wasteType: data.wasteType,
        weight: typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight,
        unit: data.unit || "ton",
        generatorDate: new Date(data.generatorDate),
        maxStorageDays: data.maxStorageDays,
        transporterName: data.transporterName || null,
        transporterLicense: data.transporterLicense || null,
        vehiclePlate: data.vehiclePlate || null,
        destinationFacility: data.destinationFacility || null,
        handlingMethod: data.handlingMethod || null,
        managerEmail: data.managerEmail || null,
        status: data.status || "stored",
        notes: data.notes || null,
        fileUrl: data.fileUrl || null,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(wasteManifests).set(payload).where(eq(wasteManifests.id, data.id));
    } else {
        payload.createdAt = new Date();
        await db.insert(wasteManifests).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'waste',
        entityId: id,
        details: JSON.stringify(payload)
    });
    revalidatePath("/dashboard/waste");
    return { success: true, id };
}

export async function deleteWasteManifest(id: string) {
    await db.delete(wasteManifests).where(eq(wasteManifests.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'waste',
        entityId: id,
    });
    revalidatePath("/dashboard/waste");
    return { success: true };
}

// --- Compliance Reports ---
export async function upsertComplianceReport(data: ComplianceReportInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload = {
        title: data.title,
        agency: data.agency,
        category: data.category || "Other",
        periodYear: data.periodYear ? (typeof data.periodYear === 'string' ? parseInt(data.periodYear) : data.periodYear) : null,
        periodValue: data.periodValue || null,
        priority: data.priority || "Medium",
        status: data.status || "Pending",
        dueDate: new Date(data.dueDate),
        submissionDate: data.submissionDate ? new Date(data.submissionDate) : null,
        description: data.description || null,
        remarks: data.remarks || null,
        attachmentUrl: data.attachmentUrl || null,
        managerEmail: data.managerEmail || null,
        assignedTo: data.assignedTo || null,
    };

    if (data.id) {
        await db.update(complianceReports).set(payload).where(eq(complianceReports.id, data.id));
    } else {
        await db.insert(complianceReports).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'compliance',
        entityId: id,
        details: JSON.stringify(payload)
    });
    revalidatePath("/dashboard/compliance");
    return { success: true, id };
}

export async function deleteComplianceReport(id: string) {
    await db.delete(complianceReports).where(eq(complianceReports.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'compliance',
        entityId: id,
    });
    revalidatePath("/dashboard/compliance");
    return { success: true };
}

export async function addComplianceComment(reportId: string, content: string, userId: string = "system") {
    const id = uuidv4();
    await db.insert(complianceComments).values({
        id,
        reportId,
        userId,
        content,
        createdAt: new Date(),
    });

    await logActivity({
        action: 'CREATE',
        entity: 'compliance_comment',
        entityId: id,
        details: JSON.stringify({ reportId, content })
    });

    revalidatePath(`/dashboard/compliance/${reportId}`);
    return { success: true, id };
}

export async function finalizeAndSubmitComplianceReport(reportId: string) {
    const report = await db.query.complianceReports.findFirst({
        where: eq(complianceReports.id, reportId)
    });

    if (!report) throw new Error("Report not found");
    if (!report.managerEmail) throw new Error("Manager email is required for submission");

    const { sendApprovalEmail } = await import("@/lib/brevo");

    // Send email first to ensure success before updating state
    try {
        await sendApprovalEmail({
            managerEmail: report.managerEmail,
            reportId: report.id,
            reportTitle: report.title,
            attachmentUrl: report.attachmentUrl
        });
    } catch (error: any) {
        console.error("Email delivery failed:", error);
        throw new Error(`Failed to send approval email: ${error.message}`);
    }

    await db.update(complianceReports).set({
        status: "Submitted",
        submissionDate: new Date()
    }).where(eq(complianceReports.id, reportId));

    await logActivity({
        action: 'UPDATE',
        entity: 'compliance',
        entityId: reportId,
        details: JSON.stringify({ status: "Submitted", workflow: "Approval Sent" })
    });

    revalidatePath("/dashboard/compliance");
    revalidatePath(`/dashboard/compliance/${reportId}`);
    return { success: true };
}

export async function approveComplianceReport(reportId: string) {
    await db.update(complianceReports).set({
        status: "Approved"
    }).where(eq(complianceReports.id, reportId));

    await logActivity({
        action: 'UPDATE',
        entity: 'compliance',
        entityId: reportId,
        details: JSON.stringify({ status: "Approved" })
    });

    revalidatePath("/dashboard/compliance");
    revalidatePath(`/dashboard/compliance/${reportId}`);
    return { success: true };
}

// --- POPAL Profiles ---
export async function upsertPopalProfile(data: PopalProfileInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload = {
        name: data.name,
        certificationNumber: data.certificationNumber,
        certifiedBy: data.certifiedBy || "BNSP",
        validityStart: new Date(data.validityStart),
        validityEnd: new Date(data.validityEnd),
        status: data.status || "active",
        companyId: data.companyId || "DEFAULT_COMPANY",
        profileImageUrl: data.profileImageUrl || null,
    };

    if (data.id) {
        await db.update(popalProfiles).set(payload).where(eq(popalProfiles.id, data.id));
    } else {
        await db.insert(popalProfiles).values({ id, ...payload });
    }

    await logActivity({ action, entity: 'popal_profile', entityId: id, details: JSON.stringify(payload) });
    revalidatePath("/dashboard/wastewater");
    return { success: true, id };
}

export async function deletePopalProfile(id: string) {
    await db.delete(popalProfiles).where(eq(popalProfiles.id, id));
    await logActivity({ action: 'DELETE', entity: 'popal_profile', entityId: id });
    revalidatePath("/dashboard/wastewater");
    return { success: true };
}

// --- Wastewater Logs (IPAL) ---
export async function upsertWastewaterLog(data: WastewaterLogInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const parseFloatSafe = (val: string | number) => typeof val === 'string' ? parseFloat(val) : val;

    const payload = {
        logDate: new Date(data.logDate),
        phLevel: parseFloatSafe(data.phLevel),
        codLevel: parseFloatSafe(data.codLevel),
        bodLevel: parseFloatSafe(data.bodLevel),
        tssLevel: parseFloatSafe(data.tssLevel),
        ammoniaLevel: parseFloatSafe(data.ammoniaLevel),
        debitOutfall: parseFloatSafe(data.debitOutfall),
        popalId: data.popalId || null,
        notes: data.notes || null,
        isViolation: data.isViolation || false,
    };

    if (data.id) {
        await db.update(wastewaterLogs).set(payload).where(eq(wastewaterLogs.id, data.id));
    } else {
        await db.insert(wastewaterLogs).values({ id, ...payload });
    }

    await logActivity({ action, entity: 'wastewater_log', entityId: id, details: JSON.stringify(payload) });
    revalidatePath("/dashboard/wastewater");
    return { success: true, id };
}

export async function deleteWastewaterLog(id: string) {
    await db.delete(wastewaterLogs).where(eq(wastewaterLogs.id, id));
    await logActivity({ action: 'DELETE', entity: 'wastewater_log', entityId: id });
    revalidatePath("/dashboard/wastewater");
    return { success: true };
}

// --- AMDAL Milestones ---
export async function upsertAmdalMilestone(data: AmdalMilestoneInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload = {
        title: data.title,
        status: data.status || "Pending",
        progress: typeof data.progress === 'string' ? parseInt(data.progress) : (data.progress || 0),
        description: data.description,
    };

    if (data.id) {
        await db.update(amdalMilestones).set(payload).where(eq(amdalMilestones.id, data.id));
    } else {
        await db.insert(amdalMilestones).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'amdal',
        entityId: id,
        details: JSON.stringify(payload)
    });
    revalidatePath("/dashboard/amdal");
    return { success: true, id };
}

export async function deleteAmdalMilestone(id: string) {
    await db.delete(amdalMilestones).where(eq(amdalMilestones.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'amdal',
        entityId: id,
    });
    revalidatePath("/dashboard/amdal");
    return { success: true };
}

export async function upsertAmdalRequirement(data: AmdalRequirementInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload = {
        documentType: data.documentType,
        parameter: data.parameter,
        type: data.type,
        frequency: data.frequency,
        lastMonitoredDate: data.lastMonitoredDate ? new Date(data.lastMonitoredDate) : null,
        nextDueDate: new Date(data.nextDueDate),
        status: data.status,
        pic: data.pic || null,
    };

    if (data.id) {
        await db.update(amdalRequirements).set(payload).where(eq(amdalRequirements.id, data.id));
    } else {
        await db.insert(amdalRequirements).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'amdal_requirement',
        entityId: id,
        details: JSON.stringify(payload)
    });
    revalidatePath("/dashboard/amdal");
    return { success: true, id };
}

export async function deleteAmdalRequirement(id: string) {
    await db.delete(amdalRequirements).where(eq(amdalRequirements.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'amdal_requirement',
        entityId: id,
    });
    revalidatePath("/dashboard/amdal");
    return { success: true };
}

// --- ISO Audits ---
export async function upsertISOAudit(data: ISOAuditInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const payload = {
        auditType: data.auditType,
        auditDate: new Date(data.auditDate),
        findingsCount: typeof data.findingsCount === 'string' ? parseInt(data.findingsCount) : (data.findingsCount || 0),
        status: data.status || "Scheduled",
    };

    if (data.id) {
        await db.update(isoAudits).set(payload).where(eq(isoAudits.id, data.id));
    } else {
        await db.insert(isoAudits).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'iso',
        entityId: id,
        details: JSON.stringify(payload)
    });
    revalidatePath("/dashboard/iso14001");
    return { success: true, id };
}

export async function deleteISOAudit(id: string) {
    await db.delete(isoAudits).where(eq(isoAudits.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'iso',
        entityId: id,
    });
    revalidatePath("/dashboard/iso14001");
    return { success: true };
}

// --- SIMPEL & RKAB ---

export type SimpelInput = {
    id?: string;
    reportId: string;
    properRating?: "GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK";
    waterStatus?: "Compliant" | "Non-Compliant" | "N/A";
    airStatus?: "Compliant" | "Non-Compliant" | "N/A";
    wasteStatus?: "Compliant" | "Non-Compliant" | "N/A";
    lastSyncDate?: Date | null;
};

export async function upsertSimpelRecord(data: SimpelInput) {
    const id = data.id || uuidv4();
    const payload = {
        id,
        reportId: data.reportId,
        properRating: data.properRating || "BLUE",
        waterStatus: data.waterStatus || "Compliant",
        airStatus: data.airStatus || "Compliant",
        wasteStatus: data.wasteStatus || "Compliant",
        lastSyncDate: data.lastSyncDate || new Date(),
    };

    if (data.id) {
        await db.update(simpelRecords).set(payload).where(eq(simpelRecords.id, data.id));
    } else {
        await db.insert(simpelRecords).values(payload);
    }

    await logActivity({
        action: data.id ? 'UPDATE' : 'CREATE',
        entity: 'simpel_record',
        entityId: id,
        details: JSON.stringify(payload)
    });

    revalidatePath(`/dashboard/compliance/${data.reportId}`);
    return { success: true, id };
}

export type RkabInput = {
    id?: string;
    reportId: string;
    year: number;
    productionTarget?: number | null;
    salesTarget?: number | null;
    explorationCost?: number | null;
    environmentalBudget?: number | null;
    technicalDocLink?: string | null;
};

export async function upsertRkabSubmission(data: RkabInput) {
    const id = data.id || uuidv4();
    const payload = {
        id,
        reportId: data.reportId,
        year: data.year,
        productionTarget: data.productionTarget || null,
        salesTarget: data.salesTarget || null,
        explorationCost: data.explorationCost || null,
        environmentalBudget: data.environmentalBudget || null,
        technicalDocLink: data.technicalDocLink || null,
    };

    if (data.id) {
        await db.update(rkabSubmissions).set(payload).where(eq(rkabSubmissions.id, data.id));
    } else {
        await db.insert(rkabSubmissions).values(payload);
    }

    await logActivity({
        action: data.id ? 'UPDATE' : 'CREATE',
        entity: 'rkab_submission',
        entityId: id,
        details: JSON.stringify(payload)
    });

    revalidatePath(`/dashboard/compliance/${data.reportId}`);
    return { success: true, id };
}

export type ProperAssessmentInput = {
    id?: string;
    year: number;
    inventory: {
        waterQualityScore: number;
        airQualityScore: number;
        hazardousWasteScore: number;
        landQualityScore: number;
        complianceLevel: "Full" | "Partial" | "None";
    };
    beyondCompliance: {
        energyEfficiencyScore: number;
        waterConservationScore: number;
        biodiversityScore: number;
        emissionReductionScore: number;
        socialInnovationScore: number;
    };
};

export async function upsertProperAssessment(data: ProperAssessmentInput) {
    const assessmentId = data.id || uuidv4();

    // Calculate Predicted Rating (Simplified Logic)
    let predictedRating: "GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK" = "BLUE";

    const avgInnovation = (
        data.beyondCompliance.energyEfficiencyScore +
        data.beyondCompliance.waterConservationScore +
        data.beyondCompliance.biodiversityScore +
        data.beyondCompliance.emissionReductionScore +
        data.beyondCompliance.socialInnovationScore
    ) / 5;

    if (data.inventory.complianceLevel === "None") {
        predictedRating = "RED";
    } else if (data.inventory.complianceLevel === "Partial") {
        predictedRating = "BLUE"; // In reality might be Red, but we'll follow simple rules
    } else {
        if (avgInnovation > 80) predictedRating = "GOLD";
        else if (avgInnovation > 60) predictedRating = "GREEN";
        else predictedRating = "BLUE";
    }

    const assessmentPayload = {
        id: assessmentId,
        year: data.year,
        predictedRating,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(properAssessments).set(assessmentPayload).where(eq(properAssessments.id, data.id));
    } else {
        await db.insert(properAssessments).values({
            ...assessmentPayload,
            status: "Draft",
            createdAt: new Date(),
        });
    }

    // Upsert Inventory
    const invExists = await db.query.properInventory.findFirst({
        where: eq(properInventory.assessmentId, assessmentId)
    });

    if (invExists) {
        await db.update(properInventory).set(data.inventory).where(eq(properInventory.assessmentId, assessmentId));
    } else {
        await db.insert(properInventory).values({
            id: uuidv4(),
            assessmentId,
            ...data.inventory
        });
    }

    // Upsert Beyond Compliance
    const beyondExists = await db.query.properBeyondCompliance.findFirst({
        where: eq(properBeyondCompliance.assessmentId, assessmentId)
    });

    if (beyondExists) {
        await db.update(properBeyondCompliance).set(data.beyondCompliance).where(eq(properBeyondCompliance.assessmentId, assessmentId));
    } else {
        await db.insert(properBeyondCompliance).values({
            id: uuidv4(),
            assessmentId,
            ...data.beyondCompliance
        });
    }

    await logActivity({
        action: data.id ? 'UPDATE' : 'CREATE',
        entity: 'proper_assessment',
        entityId: assessmentId,
        details: `Year: ${data.year}, Predicted: ${predictedRating}`
    });

    revalidatePath("/dashboard/proper");
    return { success: true, id: assessmentId, predictedRating };
}

export async function getProperAssessments() {
    return await db.query.properAssessments.findMany({
        with: {
            inventory: true,
            beyondCompliance: true
        },
        orderBy: (proper, { desc }) => [desc(proper.year)]
    });
}

// --- GHG Emissions (Phase 4) ---
export async function upsertGhgEmission(data: GhgEmissionInput) {
    const id = data.id || uuidv4();
    const action = data.id ? 'UPDATE' : 'CREATE';

    const co2e = data.value * data.emissionFactor;

    const payload = {
        date: new Date(data.date),
        scope: data.scope,
        category: data.category,
        source: data.source,
        value: data.value,
        unit: data.unit,
        emissionFactor: data.emissionFactor,
        co2e: co2e,
        notes: data.notes || null,
        evidenceUrl: data.evidenceUrl || null,
    };

    if (data.id) {
        await db.update(ghgEmissions).set(payload).where(eq(ghgEmissions.id, data.id));
    } else {
        await db.insert(ghgEmissions).values({ id, ...payload });
    }

    await logActivity({
        action,
        entity: 'ghg_emission',
        entityId: id,
        details: `Scope: ${data.scope} | Source: ${data.source} | CO2e: ${co2e.toFixed(2)}`
    });

    revalidatePath("/dashboard/ghg");
    return { success: true, id };
}

export async function deleteGhgEmission(id: string) {
    await db.delete(ghgEmissions).where(eq(ghgEmissions.id, id));
    await logActivity({
        action: 'DELETE',
        entity: 'ghg_emission',
        entityId: id,
    });
    revalidatePath("/dashboard/ghg");
    return { success: true };
}
