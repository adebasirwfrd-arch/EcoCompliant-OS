"use server"

import { db } from "@/db"
import { legalRegisters } from "@/db/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

export async function getLegalRegisters() {
    try {
        return await db.select().from(legalRegisters).orderBy(legalRegisters.no);
    } catch (error) {
        console.error("Error fetching legal registers:", error);
        return [];
    }
}

export async function createLegalRegister(data: any) {
    try {
        const id = uuidv4();
        const now = new Date();
        await db.insert(legalRegisters).values({
            ...data,
            id,
            createdAt: now,
            updatedAt: now,
        });
        revalidatePath("/dashboard/legal-register");
        return { success: true, id };
    } catch (error: any) {
        console.error("Error creating legal register:", error);
        return { success: false, error: error.message };
    }
}

export async function updateLegalRegister(id: string, data: any) {
    try {
        const now = new Date();
        await db.update(legalRegisters)
            .set({
                ...data,
                updatedAt: now,
            })
            .where(eq(legalRegisters.id, id));
        revalidatePath("/dashboard/legal-register");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating legal register:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteLegalRegister(id: string) {
    try {
        await db.delete(legalRegisters).where(eq(legalRegisters.id, id));
        revalidatePath("/dashboard/legal-register");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting legal register:", error);
        return { success: false, error: error.message };
    }
}
