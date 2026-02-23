"use server"

import { db } from "@/db"
import { auditLogs } from "@/db/schema"
import { v4 as uuidv4 } from "uuid"

export async function logActivity({
    action,
    entity,
    entityId,
    details,
    performedBy = "System Admin"
}: {
    action: 'CREATE' | 'UPDATE' | 'DELETE'
    entity: string
    entityId: string
    details?: string
    performedBy?: string
}) {
    try {
        await db.insert(auditLogs).values({
            id: uuidv4(),
            action,
            entity,
            entityId,
            details,
            performedBy,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
}
