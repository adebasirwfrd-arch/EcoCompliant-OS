"use server"

import { db } from "@/db"
import {
    isoContext,
    isoAspects,
    isoLegalRegistry,
    isoObjectives,
    isoRisks,
    isoCAPA
} from "@/db/schema"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "./audit"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// --- TYPES ---

export type ISOContextInput = {
    id?: string;
    type: "Internal" | "External" | "Interested Party";
    issue: string;
    requirement?: string | null;
    impact?: string | null;
    strategy?: string | null;
    status?: "Active" | "Archived";
};

export type ISOAspectInput = {
    id?: string;
    activity: string;
    aspect: string;
    impact: string;
    condition?: "Normal" | "Abnormal" | "Emergency";
    severity: number;
    probability: number;
    controlMeasures?: string | null;
    status?: "Active" | "Mitigated" | "Archived";
};

export type ISOLegalInput = {
    id?: string;
    regulationName: string;
    clause?: string | null;
    summary?: string | null;
    relevance: string;
    complianceStatus?: "Compliant" | "Non-Compliant" | "N/A";
    lastReviewDate?: string | Date | null;
    nextReviewDate?: string | Date | null;
    evidenceUrl?: string | null;
};

export type ISOObjectiveInput = {
    id?: string;
    objective: string;
    targetValue: string;
    indicator: string;
    baseline?: string | null;
    progress?: number;
    deadline: string | Date;
    department?: string | null;
    pic?: string | null;
    status?: "On Track" | "At Risk" | "Canceled" | "Achieved";
};

export type ISORiskInput = {
    id?: string;
    source: string;
    description: string;
    potentialImpact?: string | null;
    riskLevel: "Low" | "Medium" | "High" | "Critical";
    mitigationPlan?: string | null;
    residualRisk?: "Low" | "Medium" | "High" | "Critical" | null;
    status?: "Open" | "Mitigated" | "Closed";
};

export type ISOCAPAInput = {
    id?: string;
    source: string;
    description: string;
    ncType: "Major" | "Minor" | "OFI";
    rootCause?: string | null;
    correctiveAction?: string | null;
    preventiveAction?: string | null;
    dueDate: string | Date;
    closedDate?: string | Date | null;
    status?: "Open" | "Verified" | "Closed";
    pic?: string | null;
};

// --- ACTIONS ---

const revalidate = () => revalidatePath("/dashboard/iso14001");

export async function upsertISOContext(data: ISOContextInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(isoContext).set(payload).where(eq(isoContext.id, data.id));
    } else {
        await db.insert(isoContext).values({ id, ...payload });
    }

    await logActivity({ action, entity: "iso_context", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISOContext(id: string) {
    await db.delete(isoContext).where(eq(isoContext.id, id));
    await logActivity({ action: "DELETE", entity: "iso_context", entityId: id });
    revalidate();
    return { success: true };
}

export async function upsertISOAspect(data: ISOAspectInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";

    // Auto-calculate significance
    const significanceScore = data.severity * data.probability;
    const isSignificant = significanceScore >= 12; // Significance threshold threshold (typically 12-15 in EMS)

    const payload = {
        ...data,
        significanceScore,
        isSignificant,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(isoAspects).set(payload).where(eq(isoAspects.id, data.id));
    } else {
        await db.insert(isoAspects).values({ id, ...payload });
    }

    await logActivity({ action, entity: "iso_aspect", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISOAspect(id: string) {
    await db.delete(isoAspects).where(eq(isoAspects.id, id));
    await logActivity({ action: "DELETE", entity: "iso_aspect", entityId: id });
    revalidate();
    return { success: true };
}

export async function upsertISOLegalRequirement(data: ISOLegalInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        lastReviewDate: data.lastReviewDate ? new Date(data.lastReviewDate) : null,
        nextReviewDate: data.nextReviewDate ? new Date(data.nextReviewDate) : null,
    };

    if (data.id) {
        await db.update(isoLegalRegistry).set(payload).where(eq(isoLegalRegistry.id, data.id));
    } else {
        await db.insert(isoLegalRegistry).values({ id, ...payload });
    }

    await logActivity({ action, entity: "iso_legal", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISOLegalRequirement(id: string) {
    await db.delete(isoLegalRegistry).where(eq(isoLegalRegistry.id, id));
    await logActivity({ action: "DELETE", entity: "iso_legal", entityId: id });
    revalidate();
    return { success: true };
}

export async function upsertISOObjective(data: ISOObjectiveInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        deadline: new Date(data.deadline),
    };

    if (data.id) {
        await db.update(isoObjectives).set(payload).where(eq(isoObjectives.id, data.id));
    } else {
        await db.insert(isoObjectives).values({ id, ...payload });
    }

    await logActivity({ action, entity: "iso_objective", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISOObjective(id: string) {
    await db.delete(isoObjectives).where(eq(isoObjectives.id, id));
    await logActivity({ action: "DELETE", entity: "iso_objective", entityId: id });
    revalidate();
    return { success: true };
}

export async function upsertISORisk(data: ISORiskInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";

    if (data.id) {
        await db.update(isoRisks).set(data).where(eq(isoRisks.id, data.id));
    } else {
        await db.insert(isoRisks).values({ id, ...data });
    }

    await logActivity({ action, entity: "iso_risk", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISORisk(id: string) {
    await db.delete(isoRisks).where(eq(isoRisks.id, id));
    await logActivity({ action: "DELETE", entity: "iso_risk", entityId: id });
    revalidate();
    return { success: true };
}

export async function upsertISOCAPA(data: ISOCAPAInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        dueDate: new Date(data.dueDate),
        closedDate: data.closedDate ? new Date(data.closedDate) : null,
    };

    if (data.id) {
        await db.update(isoCAPA).set(payload).where(eq(isoCAPA.id, data.id));
    } else {
        await db.insert(isoCAPA).values({ id, ...payload });
    }

    await logActivity({ action, entity: "iso_capa", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteISOCAPA(id: string) {
    await db.delete(isoCAPA).where(eq(isoCAPA.id, id));
    await logActivity({ action: "DELETE", entity: "iso_capa", entityId: id });
    revalidate();
    return { success: true };
}
