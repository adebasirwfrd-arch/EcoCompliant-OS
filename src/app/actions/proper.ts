"use server"

import { db } from "@/db"
import {
    properAssessments,
    properInventory,
    properBeyondCompliance,
    properCriteriaResults,
    properCommunityDev
} from "@/db/schema"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "./audit"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const revalidate = () => revalidatePath("/dashboard/proper");

export type PROPERAssessmentInput = {
    id?: string;
    year: number;
};

export async function upsertPROPERAssessment(data: PROPERAssessmentInput) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";

    const payload = {
        ...data,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(properAssessments).set(payload).where(eq(properAssessments.id, data.id));
    } else {
        await db.insert(properAssessments).values({
            id,
            ...payload,
            status: "Draft",
            createdAt: new Date(),
        });

        // Initialize inventory and beyond compliance if new
        await db.insert(properInventory).values({ id: uuidv4(), assessmentId: id });
        await db.insert(properBeyondCompliance).values({ id: uuidv4(), assessmentId: id });
    }

    await logActivity({ action, entity: "proper_assessment", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function upsertPROPERCriteria(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = { ...data, updatedAt: new Date() };

    if (data.id) {
        await db.update(properCriteriaResults).set(payload).where(eq(properCriteriaResults.id, data.id));
    } else {
        await db.insert(properCriteriaResults).values({ id, ...payload });
    }

    await logActivity({ action, entity: "proper_criteria", entityId: id });

    // Trigger rating recalculation
    if (data.assessmentId) {
        await calculatePROPERRating(data.assessmentId);
    }

    revalidate();
    return { success: true };
}

export async function upsertPROPERCommunityDev(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = { ...data, updatedAt: new Date() };

    if (data.id) {
        await db.update(properCommunityDev).set(payload).where(eq(properCommunityDev.id, data.id));
    } else {
        await db.insert(properCommunityDev).values({ id, ...payload });
    }

    await logActivity({ action, entity: "proper_comdev", entityId: id });
    revalidate();
    return { success: true };
}

export async function calculatePROPERRating(assessmentId: string) {
    const assessment = await db.query.properAssessments.findFirst({
        where: eq(properAssessments.id, assessmentId),
        with: {
            inventory: true,
            beyondCompliance: true
        }
    });

    if (!assessment) return;

    const criteria = await db.query.properCriteriaResults.findMany({
        where: eq(properCriteriaResults.assessmentId, assessmentId)
    });

    // 1. Compliance Logic (Blue/Red/Black)
    // Blue = 100% fulfill relevant "Compliance" parameters
    const complianceItems = criteria.filter(c => ["Air", "Water", "B3 Waste", "Land"].includes(c.category));
    const allCompliant = complianceItems.length > 0 && complianceItems.every(c => c.fulfillment === "Yes" || c.fulfillment === "N/A");

    let rating: "GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK" = "BLUE";

    if (!allCompliant) {
        rating = "RED"; // High level simplification
    } else {
        // 2. Beyond Compliance Logic (Green/Gold)
        const greenItems = criteria.filter(c => ["Energy", "Biodiversity", "Global Warming"].includes(c.category));
        const greenScore = greenItems.reduce((acc, curr) => acc + (curr.score || 0), 0) / (greenItems.length || 1);

        const comDev = await db.query.properCommunityDev.findMany({
            where: eq(properCommunityDev.assessmentId, assessmentId)
        });

        const comDevInnovation = comDev.some(cd => cd.innovationType === "Social" || cd.sroiScore && cd.sroiScore > 3);

        if (greenScore > 80 && comDevInnovation) {
            rating = "GOLD";
        } else if (greenScore > 50) {
            rating = "GREEN";
        } else {
            rating = "BLUE";
        }
    }

    await db.update(properAssessments).set({
        predictedRating: rating,
        updatedAt: new Date()
    }).where(eq(properAssessments.id, assessmentId));

    revalidate();
}

export async function getProperDetailedAssessment(id: string) {
    return await db.query.properAssessments.findFirst({
        where: eq(properAssessments.id, id),
        with: {
            inventory: true,
            beyondCompliance: true
        }
    });
}

export async function getProperCriteria(assessmentId: string) {
    return await db.query.properCriteriaResults.findMany({
        where: eq(properCriteriaResults.assessmentId, assessmentId)
    });
}

export async function getProperCommunityPrograms(assessmentId: string) {
    return await db.query.properCommunityDev.findMany({
        where: eq(properCommunityDev.assessmentId, assessmentId)
    });
}

export async function deletePROPERAssessment(id: string) {
    await db.delete(properAssessments).where(eq(properAssessments.id, id));
    await logActivity({ action: "DELETE", entity: "proper_assessment", entityId: id });
    revalidate();
    return { success: true };
}

export async function deletePROPERCriteria(id: string) {
    const item = await db.query.properCriteriaResults.findFirst({
        where: eq(properCriteriaResults.id, id)
    });

    await db.delete(properCriteriaResults).where(eq(properCriteriaResults.id, id));

    if (item?.assessmentId) {
        await calculatePROPERRating(item.assessmentId);
    }

    await logActivity({ action: "DELETE", entity: "proper_criteria", entityId: id });
    revalidate();
    return { success: true };
}

export async function deletePROPERCommunityProgram(id: string) {
    await db.delete(properCommunityDev).where(eq(properCommunityDev.id, id));
    await logActivity({ action: "DELETE", entity: "proper_comdev", entityId: id });
    revalidate();
    return { success: true };
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
