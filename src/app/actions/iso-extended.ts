"use server"

import { db } from "@/db"
import {
    isoInterestedParties,
    isoOperationalControls,
    isoEmergencyPrep,
    isoPerformanceMonitoring,
    isoInternalAudits,
    isoManagementReviews,
    isoObjectives,
    isoCAPA
} from "@/db/schema"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "./audit"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const revalidate = () => revalidatePath("/dashboard/iso14001");

// --- INTERESTED PARTIES (CL 4.2) ---
export async function upsertInterestedParty(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = { ...data, updatedAt: new Date() };
    if (data.id) {
        await db.update(isoInterestedParties).set(payload).where(eq(isoInterestedParties.id, data.id));
    } else {
        await db.insert(isoInterestedParties).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_interested_party", entityId: id });
    revalidate();
    return { success: true };
}

// --- OPERATIONAL CONTROLS (CL 8.1) ---
export async function upsertOperationalControl(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = { ...data, updatedAt: new Date() };
    if (data.id) {
        await db.update(isoOperationalControls).set(payload).where(eq(isoOperationalControls.id, data.id));
    } else {
        await db.insert(isoOperationalControls).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_operational_control", entityId: id });
    revalidate();
    return { success: true };
}

// --- EMERGENCY PREPAREDNESS (CL 8.2) ---
export async function upsertEmergencyPrep(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        lastDrillDate: data.lastDrillDate ? new Date(data.lastDrillDate) : null,
        nextDrillDate: data.nextDrillDate ? new Date(data.nextDrillDate) : null,
        updatedAt: new Date()
    };
    if (data.id) {
        await db.update(isoEmergencyPrep).set(payload).where(eq(isoEmergencyPrep.id, data.id));
    } else {
        await db.insert(isoEmergencyPrep).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_emergency_prep", entityId: id });
    revalidate();
    return { success: true };
}

// --- PERFORMANCE MONITORING (CL 9.1) ---
export async function upsertPerformanceMonitoring(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = { ...data, updatedAt: new Date() };
    if (data.id) {
        await db.update(isoPerformanceMonitoring).set(payload).where(eq(isoPerformanceMonitoring.id, data.id));
    } else {
        await db.insert(isoPerformanceMonitoring).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_monitoring", entityId: id });
    revalidate();
    return { success: true };
}

// --- INTERNAL AUDITS (CL 9.2) ---
export async function upsertInternalAudit(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        auditDate: new Date(data.auditDate),
        updatedAt: new Date()
    };
    if (data.id) {
        await db.update(isoInternalAudits).set(payload).where(eq(isoInternalAudits.id, data.id));
    } else {
        await db.insert(isoInternalAudits).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_internal_audit", entityId: id });
    revalidate();
    return { success: true };
}

// --- MANAGEMENT REVIEWS (CL 9.3) ---
export async function upsertManagementReview(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        meetingDate: new Date(data.meetingDate),
        updatedAt: new Date()
    };
    if (data.id) {
        await db.update(isoManagementReviews).set(payload).where(eq(isoManagementReviews.id, data.id));
    } else {
        await db.insert(isoManagementReviews).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_management_review", entityId: id });
    revalidate();
    return { success: true };
}

// --- OBJECTIVES (CL 6.2) ---
export async function upsertISOObjective(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : new Date(),
        updatedAt: new Date()
    };
    if (data.id) {
        await db.update(isoObjectives).set(payload).where(eq(isoObjectives.id, data.id));
    } else {
        await db.insert(isoObjectives).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_objective", entityId: id });
    revalidate();
    return { success: true };
}

// --- CAPA (CL 10.2) ---
export async function upsertISOCAPA(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        closedDate: data.closedDate ? new Date(data.closedDate) : null,
        updatedAt: new Date()
    };
    if (data.id) {
        await db.update(isoCAPA).set(payload).where(eq(isoCAPA.id, data.id));
    } else {
        await db.insert(isoCAPA).values({ id, ...payload });
    }
    await logActivity({ action, entity: "iso_capa", entityId: id });
    revalidate();
    return { success: true };
}
