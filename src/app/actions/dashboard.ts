"use server"

import { db } from "@/db"
import {
    esgAssessments,
    ghgEmissions,
    wasteManifests,
    complianceReports,
    wastewaterLogs,
    domesticWasteLogs,
    properAssessments,
    isoContext,
    amdalMilestones
} from "@/db/schema"
import { desc, eq, asc } from "drizzle-orm"

export async function getDashboardStats() {
    try {
        // 1. ESG Stats
        const latestEsg = await db.query.esgAssessments.findFirst({
            orderBy: (assessments, { desc }) => [desc(assessments.updatedAt)],
            with: { answers: true }
        });

        // 2. GHG Stats (Current month total)
        const ghgData = await db.query.ghgEmissions.findMany({
            orderBy: [desc(ghgEmissions.date)],
            limit: 12
        });
        const currentMonthEmi = ghgData.length > 0 ? ghgData[0].co2e : 0;

        // 3. Proper/Compliance Health
        const latestProper = await db.query.properAssessments.findFirst({
            orderBy: [desc(properAssessments.updatedAt)]
        });

        // 4. Waste Stats (Hazardous weight)
        const hazardousWasteAll = await db.query.wasteManifests.findMany();
        const totalHazardous = hazardousWasteAll.reduce((acc, curr) => acc + curr.weight, 0);

        // 5. Domestic Waste Stats
        const domesticLogs = await db.query.domesticWasteLogs.findMany({
            limit: 50
        });
        const totalDomestic = domesticLogs.reduce((acc, curr) => acc + (curr.weight || 0), 0);

        // 6. Wastewater Stats
        const waterLogs = await db.query.wastewaterLogs.findMany({
            orderBy: [desc(wastewaterLogs.logDate)],
            limit: 10
        });
        const avgPh = waterLogs.length > 0
            ? (waterLogs.reduce((acc, curr) => acc + curr.phLevel, 0) / waterLogs.length).toFixed(1)
            : "7.0";

        // 7. ISO Status
        const isoContextItems = await db.query.isoContext.findMany({
            where: eq(isoContext.status, "Active")
        });

        // 8. AMDAL Milestones
        const amdalSummary = await db.query.amdalMilestones.findMany({
            limit: 5
        });

        // 9. Upcoming Deadlines
        const reports = await db.query.complianceReports.findMany({
            orderBy: (reports, { asc }) => [asc(reports.dueDate)],
            limit: 5
        });

        return {
            esg: {
                score: latestEsg?.overallScore || 0,
                level: latestEsg?.maturityLevel || "Initial",
                title: latestEsg?.title || "N/A"
            },
            ghg: {
                total: currentMonthEmi,
                trend: ghgData.map(d => ({ name: d.date.toLocaleDateString(), value: d.co2e }))
            },
            compliance: {
                rating: latestProper?.finalRating || latestProper?.predictedRating || "BLUE",
                health: 94,
                isoCount: isoContextItems.length,
                amdalProgress: amdalSummary.length > 0 ? amdalSummary[0].progress : 0
            },
            waste: {
                hazardous: totalHazardous,
                domestic: totalDomestic
            },
            water: {
                ph: avgPh,
                logs: waterLogs.map(l => ({ name: l.logDate.toLocaleDateString(), value: l.phLevel }))
            },
            reports
        };
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return null;
    }
}
