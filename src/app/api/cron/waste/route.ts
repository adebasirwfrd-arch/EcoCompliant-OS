import { NextResponse } from "next/server";
import { db } from "@/db";
import { addDays, differenceInDays } from "date-fns";
import { sendWasteReminderEmail } from "@/lib/brevo";

export async function GET(request: Request) {
    try {
        // Find all active stored waste manifests
        const activeStored = await db.query.wasteManifests.findMany({
            where: (manifests, { eq }) => eq(manifests.status, 'stored'),
        });

        const today = new Date();
        let emailsSent = 0;
        const failures: any[] = [];

        // Check which items are exactly 7 days before their specific deadline
        // Or if you want a window (e.g. <= 7 days), we use a threshold. For CRON, usually exact days to prevent spam.
        // We will send if they are exactly 7 days away, or between 0 and 7 days.
        // Let's assume this CRON runs daily, sending ONE email when daysLeft === 7. 
        // For testing/reliability, we'll trigger if daysLeft <= 7 and managerEmail exists.

        for (const record of activeStored) {
            if (!record.managerEmail) continue;

            const generationDate = new Date(record.generatorDate);
            const deadlineDate = addDays(generationDate, record.maxStorageDays);
            const daysLeft = differenceInDays(deadlineDate, today);

            // Send trigger exactly at 7 days OR if we want a continuous warning, we'd need an 'email_sent' flag in DB.
            // Since we don't have an email_sent flag, we'll trigger if it's exactly 7 days away.
            // (In a real production app, we would add 'reminder_sent_at' column).
            // For now, let's trigger if we are within the 7 day window. If user tests it, they might hit it multiple times.

            if (daysLeft === 7) {
                try {
                    await sendWasteReminderEmail({
                        managerEmail: record.managerEmail,
                        manifestNumber: record.manifestNumber || "N/A",
                        wasteType: record.wasteType,
                        deadlineDate: deadlineDate,
                        maxStorageDays: record.maxStorageDays
                    });
                    emailsSent++;
                } catch (error: any) {
                    console.error(`Failed to send waste reminder to ${record.managerEmail}`, error);
                    failures.push({ id: record.id, error: error.message });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Cron executed. Found ${activeStored.length} stored records. Emails sent: ${emailsSent}`,
            failures
        });

    } catch (error: any) {
        console.error("Waste Cron error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
