"use server"

import { db } from "@/db"
import { complianceComments } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function addComplianceComment(reportId: string, content: string, userEmail: string) {
    try {
        if (!content || !content.trim()) {
            throw new Error("Comment content cannot be empty")
        }

        // Fetch user id from the users table based on email
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, userEmail),
        });

        if (!user) {
            // For resilience, if the user isn't found in the DB (like if they are a raw auth user without a users table entry yet in development), 
            // we will simulate the user id so it doesn't crash the feature.
            console.warn(`User email ${userEmail} not found in database. Proceeding with email as ID for demo.`);
        }

        const userId = user?.id || userEmail;

        await db.insert(complianceComments).values({
            id: uuidv4(),
            reportId: reportId,
            userId: userId, // Using ID, but component will receive Email later.
            content: content.trim(),
            createdAt: new Date(),
        })

        revalidatePath(`/dashboard/compliance/${reportId}`)

        return { success: true }
    } catch (error: any) {
        console.error("Failed to add comment:", error)
        return { success: false, error: error.message }
    }
}
