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
    amdalMilestones,
    legalRegisters,
    amdalRequirements,
    isoObjectives,
    isoCAPA
} from "@/db/schema"
import { desc, eq, asc, gte, lte, and, lt } from "drizzle-orm"

export async function getDashboardStats() {
    try {
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

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

        // 4. Waste Stats
        const wasteAll = await db.query.wasteManifests.findMany();
        const totalHazardous = wasteAll.reduce((acc, curr) => acc + curr.weight, 0);

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

        // 9. Upcoming Deadlines (Reports)
        const reports = await db.query.complianceReports.findMany({
            orderBy: (reports, { asc }) => [asc(reports.dueDate)],
            limit: 10
        });

        // --- AGGREGATE UPCOMING EVENTS ---
        const legalReviews = await db.query.legalRegisters.findMany({
            where: and(gte(legalRegisters.nextReviewDate, now), lte(legalRegisters.nextReviewDate, endOfMonth))
        });

        const reportDeadlines = reports.filter(r => r.dueDate >= now && r.dueDate <= endOfMonth);

        const amdalNext = await db.query.amdalRequirements.findMany({
            where: and(gte(amdalRequirements.nextDueDate, now), lte(amdalRequirements.nextDueDate, endOfMonth))
        });

        const upcomingEvents = [
            ...legalReviews.map(l => ({ title: l.title || "Legal Review", date: l.nextReviewDate, type: "Legal", id: l.id })),
            ...reportDeadlines.map(r => ({ title: r.title, date: r.dueDate, type: "Report", id: r.id })),
            ...amdalNext.map(a => ({ title: a.parameter, date: a.nextDueDate, type: "AMDAL", id: a.id }))
        ].sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

        // --- AGGREGATE ACTION REQUIRED ---
        const overdueReports = reports.filter(r => r.status === "Pending" && (r.dueDate?.getTime() || 0) < now.getTime());
        const openCapa = await db.query.isoCAPA.findMany({ where: eq(isoCAPA.status, "Open") });
        const storedWasteLong = wasteAll.filter(w => w.status === "stored" && (now.getTime() - w.createdAt.getTime()) > (w.maxStorageDays * 24 * 60 * 60 * 1000));

        const actionRequired = [
            ...overdueReports.map(r => ({ title: r.title, date: r.dueDate, type: "Overdue", id: r.id })),
            ...openCapa.map(c => ({ title: c.description, date: c.dueDate, type: "CAPA", id: c.id })),
            ...storedWasteLong.map(w => ({ title: `Waste stored too long: ${w.wasteType}`, date: w.createdAt, type: "Waste", id: w.id }))
        ];

        // --- IMPACT SCORE CALCULATION ---
        const esgWeight = 0.3;
        const complianceWeight = 0.4;
        const properWeight = 0.3;

        const esgPart = (latestEsg?.overallScore || 0);

        const submittedCount = reports.filter(r => r.status === "Submitted" || r.status === "Approved").length;
        const compliancePart = (submittedCount / (reports.length || 1)) * 100;

        const ratingMap: Record<string, number> = { "GOLD": 100, "GREEN": 80, "BLUE": 60, "RED": 40, "BLACK": 20 };
        const properPart = ratingMap[latestProper?.finalRating || latestProper?.predictedRating || "BLUE"];

        const totalHealth = (esgPart * esgWeight) + (compliancePart * complianceWeight) + (properPart * properWeight);

        return {
            esg: {
                score: esgPart,
                level: latestEsg?.maturityLevel || "Initial",
                title: latestEsg?.title || "N/A"
            },
            ghg: {
                total: currentMonthEmi,
                trend: ghgData.map(d => ({ name: d.date.toLocaleDateString(), value: d.co2e }))
            },
            compliance: {
                rating: latestProper?.finalRating || latestProper?.predictedRating || "BLUE",
                health: Math.round(totalHealth),
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
            reports: reports.slice(0, 5),
            upcomingEvents: upcomingEvents.slice(0, 5),
            actionRequired: actionRequired.slice(0, 10)
        };
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return null;
    }
}
