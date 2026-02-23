import { NextResponse } from 'next/server';
import { db } from '@/db';
import { complianceReports } from '@/db/schema';
import { eq, or, and, lte, gte } from 'drizzle-orm';
import { sendReminderEmail } from '@/lib/brevo';
import { addDays, startOfDay, endOfDay } from 'date-fns';

// This endpoint is meant to be called daily via Vercel Cron or similar service.
export async function GET(request: Request) {
    try {
        // Simple security check (in a real app, verify a secret cron key)
        const authHeader = request.headers.get('authorization');
        const url = new URL(request.url);
        const testMode = url.searchParams.get('test') === 'true';

        // Find date exactly 7 days from now
        const targetDate = addDays(new Date(), 7);
        const startTarget = startOfDay(targetDate);
        const endTarget = endOfDay(targetDate);

        console.log(`[CRON] Looking for reports due between ${startTarget.toISOString()} and ${endTarget.toISOString()}`);

        const impendingReports = await db.query.complianceReports.findMany({
            where: and(
                or(
                    eq(complianceReports.status, "Pending"),
                    eq(complianceReports.status, "Rejected") // Remind rejected ones too
                ),
                gte(complianceReports.dueDate, startTarget),
                lte(complianceReports.dueDate, endTarget)
            ),
        });

        console.log(`[CRON] Found ${impendingReports.length} reports needing reminders.`);

        const sendingResults = [];

        for (const report of impendingReports) {
            // Prefer managerEmail, fallback to a system default for testing
            const emailToSendTo = report.managerEmail || report.assignedTo || "ade.basirwfrd@gmail.com";

            try {
                if (testMode) {
                    // Send test email regardless of date if specific report logic is mocked, 
                    // However, here we just respect the DB result. 
                }

                await sendReminderEmail({
                    recipientEmail: emailToSendTo,
                    reportId: report.id,
                    reportTitle: report.title,
                    dueDate: report.dueDate
                });

                sendingResults.push({ reportId: report.id, status: 'sent', recipient: emailToSendTo });
                console.log(`[CRON] Sent reminder for report ${report.id} to ${emailToSendTo}`);
            } catch (err: any) {
                console.error(`[CRON] Failed to send reminder for ${report.id}:`, err);
                sendingResults.push({ reportId: report.id, status: 'failed', error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            reportsProcessed: impendingReports.length,
            results: sendingResults
        });

    } catch (error: any) {
        console.error("[CRON] Error executing reminders chore:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
