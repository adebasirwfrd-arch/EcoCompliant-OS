"use server"

import { db } from "@/db"
import { domesticWasteLogs, wastePartners, wasteSources } from "@/db/schema"
import { v4 as uuidv4 } from "uuid"
import { logActivity } from "./audit"
import { eq, desc, and, gte, lte } from "drizzle-orm"
import { revalidatePath } from "next/cache"

const revalidate = () => revalidatePath("/dashboard/domestic-waste");

export async function upsertWasteLog(data: any) {
    const id = data.id || uuidv4();
    const action = data.id ? "UPDATE" : "CREATE";
    const payload = {
        ...data,
        updatedAt: new Date(),
    };

    if (data.id) {
        await db.update(domesticWasteLogs).set(payload).where(eq(domesticWasteLogs.id, data.id));
    } else {
        await db.insert(domesticWasteLogs).values({
            id,
            ...payload,
            createdAt: new Date(),
        });
    }

    await logActivity({ action, entity: "domestic_waste", entityId: id });
    revalidate();
    return { success: true, id };
}

export async function deleteWasteLog(id: string) {
    await db.delete(domesticWasteLogs).where(eq(domesticWasteLogs.id, id));
    await logActivity({ action: "DELETE", entity: "domestic_waste", entityId: id });
    revalidate();
    return { success: true };
}

export async function getWasteLogs() {
    return await db.query.domesticWasteLogs.findMany({
        with: {
            destination: true,
            source: true
        },
        orderBy: [desc(domesticWasteLogs.date)]
    });
}

// --- Waste Partners CRUD ---

export async function getWastePartners() {
    return await db.query.wastePartners.findMany();
}

export async function upsertWastePartner(data: any) {
    const id = data.id || uuidv4();
    if (data.id) {
        await db.update(wastePartners).set(data).where(eq(wastePartners.id, id));
    } else {
        await db.insert(wastePartners).values({ id, ...data });
    }
    revalidate();
    return { success: true, id };
}

export async function deleteWastePartner(id: string) {
    await db.delete(wastePartners).where(eq(wastePartners.id, id));
    revalidate();
    return { success: true };
}

// --- Waste Sources CRUD ---

export async function getWasteSources() {
    return await db.query.wasteSources.findMany();
}

export async function upsertWasteSource(data: any) {
    const id = data.id || uuidv4();
    if (data.id) {
        await db.update(wasteSources).set(data).where(eq(wasteSources.id, id));
    } else {
        await db.insert(wasteSources).values({ id, ...data });
    }
    revalidate();
    return { success: true, id };
}

export async function deleteWasteSource(id: string) {
    await db.delete(wasteSources).where(eq(wasteSources.id, id));
    revalidate();
    return { success: true };
}

export async function getWasteAnalytics() {
    const logs = await db.query.domesticWasteLogs.findMany({
        with: {
            destination: true,
            source: true
        }
    });

    // Calculate totals, converting m3 to kg for a unified "Total Weight" view if needed, 
    // but for now let's just sum what we have in kg.
    const totalWeight = logs.reduce((acc, curr) => acc + (curr.weight || 0), 0);
    const divertedWeight = logs
        .filter(log => log.destination?.type === "Recycler" || log.destination?.type === "TPS3R")
        .reduce((acc, curr) => acc + (curr.weight || 0), 0);

    const diversionRate = totalWeight > 0 ? (divertedWeight / totalWeight) * 100 : 0;

    // Composition
    const composition = logs.reduce((acc: any, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + (curr.weight || 0);
        return acc;
    }, {});

    const compositionData = Object.entries(composition).map(([name, value]) => ({ name, value }));

    // Monthly Trend (Last 6 months)
    const monthlyTrend: any = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyTrend[monthYear] = 0;
    }

    logs.forEach(log => {
        const date = new Date(log.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyTrend[monthYear] !== undefined) {
            monthlyTrend[monthYear] += (log.weight || 0);
        }
    });

    const trendData = Object.entries(monthlyTrend).map(([month, weight]) => ({ month, weight }));

    // Breakdown by Source
    const sourceBreakdown = logs.reduce((acc: any, curr) => {
        const sourceName = curr.source?.name || "Unassigned";
        acc[sourceName] = (acc[sourceName] || 0) + (curr.weight || 0);
        return acc;
    }, {});

    const sourceData = Object.entries(sourceBreakdown).map(([name, weight]) => ({
        name,
        weight,
        percentage: totalWeight > 0 ? ((weight as number) / totalWeight) * 100 : 0
    }));

    return {
        totalWeight,
        divertedWeight,
        diversionRate,
        compositionData,
        trendData,
        sourceData
    };
}
