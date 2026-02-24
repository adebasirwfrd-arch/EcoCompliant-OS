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
    isoCAPA,
    isoAudits,
    isoEmergencyPrep,
    isoInternalAudits,
    isoManagementReviews,
    popalProfiles
} from "@/db/schema"
import { desc, eq, asc, gte, lte, and, lt } from "drizzle-orm"

export async function getDashboardStats() {
    try {
        const now = new Date();
        const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

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
        const horizon = ninetyDaysFromNow;

        const legalReviews = await db.query.legalRegisters.findMany({
            where: and(gte(legalRegisters.nextReviewDate, now), lte(legalRegisters.nextReviewDate, horizon))
        });

        const reportDeadlines = await db.query.complianceReports.findMany({
            where: and(gte(complianceReports.dueDate, now), lte(complianceReports.dueDate, horizon))
        });

        const amdalNext = await db.query.amdalRequirements.findMany({
            where: and(gte(amdalRequirements.nextDueDate, now), lte(amdalRequirements.nextDueDate, horizon))
        });

        const objectiveDeadlines = await db.query.isoObjectives.findMany({
            where: and(gte(isoObjectives.deadline, now), lte(isoObjectives.deadline, horizon))
        });

        const auditDates = await db.query.isoAudits.findMany({
            where: and(gte(isoAudits.auditDate, now), lte(isoAudits.auditDate, horizon))
        });

        const upcomingEvents = [
            ...legalReviews.map(l => ({
                title: l.title || "Legal Review",
                date: l.nextReviewDate,
                type: "Legal",
                id: l.id,
                link: "/dashboard/legal-register"
            })),
            ...reportDeadlines.map(r => ({
                title: r.title,
                date: r.dueDate,
                type: "Report",
                id: r.id,
                link: "/dashboard/compliance"
            })),
            ...amdalNext.map(a => ({
                title: a.parameter,
                date: a.nextDueDate,
                type: "AMDAL",
                id: a.id,
                link: "/dashboard/amdal"
            })),
            ...objectiveDeadlines.map(o => ({
                title: o.objective,
                date: o.deadline,
                type: "Objective",
                id: o.id,
                link: "/dashboard/iso14001"
            })),
            ...auditDates.map(aud => ({
                title: aud.auditType,
                date: aud.auditDate,
                type: "Audit",
                id: aud.id,
                link: "/dashboard/audit"
            }))
        ]

        // Add waste storage deadlines to upcoming
        const storedWaste = await db.query.wasteManifests.findMany({
            where: eq(wasteManifests.status, "stored")
        });

        storedWaste.forEach(w => {
            const deadline = new Date(w.generatorDate.getTime() + w.maxStorageDays * 24 * 60 * 60 * 1000);
            if (deadline >= now && deadline <= horizon) {
                upcomingEvents.push({
                    title: `Waste Storage Limit: ${w.wasteType}`,
                    date: deadline,
                    type: "Waste",
                    id: w.id,
                    link: "/dashboard/waste"
                });
            }
        });

        upcomingEvents.sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

        // --- AGGREGATE ACTION REQUIRED ---
        const overdueReports = reports.filter(r => r.status === "Pending" && (r.dueDate?.getTime() || 0) < now.getTime());
        const openCapa = await db.query.isoCAPA.findMany({ where: eq(isoCAPA.status, "Open") });
        const storedWasteLong = wasteAll.filter(w => w.status === "stored" && (now.getTime() - w.createdAt.getTime()) > (w.maxStorageDays * 24 * 60 * 60 * 1000));

        const actionRequired = [
            ...overdueReports.map(r => ({
                title: r.title,
                date: r.dueDate,
                type: "Overdue",
                id: r.id,
                link: "/dashboard/compliance"
            })),
            ...openCapa.map(c => ({
                title: c.description,
                date: c.dueDate,
                type: "CAPA",
                id: c.id,
                link: "/dashboard/iso14001"
            })),
            ...storedWasteLong.map(w => ({
                title: `Waste stored too long: ${w.wasteType}`,
                date: w.createdAt,
                type: "Waste",
                id: w.id,
                link: "/dashboard/waste"
            }))
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

import { CalendarEvent } from "@/components/shared/dashboard-calendar"

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
    try {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);

        // Fetch all relevant dates from all modules
        const legalReviews = await db.query.legalRegisters.findMany();
        const reports = await db.query.complianceReports.findMany();
        const amdalNext = await db.query.amdalRequirements.findMany();
        const caps = await db.query.isoCAPA.findMany();
        const objectives = await db.query.isoObjectives.findMany();
        const audits = await db.query.isoAudits.findMany();
        const drills = await db.query.isoEmergencyPrep.findMany();
        const internalAudits = await db.query.isoInternalAudits.findMany();
        const mgmtReviews = await db.query.isoManagementReviews.findMany();

        const rawEvents = [
            ...legalReviews.map(l => ({
                id: `legal-${l.id}`,
                title: l.title || "Legal Review",
                date: l.nextReviewDate,
                type: "Legal",
                link: "/dashboard/legal-register",
                status: "Planned"
            })),
            ...reports.map(r => ({
                id: `report-${r.id}`,
                title: r.title,
                date: r.dueDate,
                type: "Report",
                link: "/dashboard/compliance",
                status: r.status || "Pending"
            })),
            ...amdalNext.map(a => ({
                id: `amdal-${a.id}`,
                title: a.parameter,
                date: a.nextDueDate,
                type: "AMDAL",
                link: "/dashboard/amdal",
                status: "Pending"
            })),
            ...caps.map(c => ({
                id: `capa-${c.id}`,
                title: c.description,
                date: c.dueDate,
                type: "CAPA",
                link: "/dashboard/iso14001",
                status: c.status || "Open"
            })),
            ...objectives.map(o => ({
                id: `obj-${o.id}`,
                title: o.objective,
                date: o.deadline,
                type: "Objective",
                link: "/dashboard/iso14001",
                status: o.status || "Active"
            })),
            ...audits.map(aud => ({
                id: `aud-${aud.id}`,
                title: `Audit: ${aud.auditType}`,
                date: aud.auditDate,
                type: "Audit",
                link: "/dashboard/audit",
                status: aud.status || "Scheduled"
            })),
            ...drills.map(d => ({
                id: `drill-${d.id}`,
                title: `Drill: ${d.scenario}`,
                date: d.nextDrillDate,
                type: "Emergency",
                link: "/dashboard/iso14001",
                status: d.status || "Ready"
            })),
            ...internalAudits.map(ia => ({
                id: `iaud-${ia.id}`,
                title: ia.auditTitle,
                date: ia.auditDate,
                type: "Audit",
                link: "/dashboard/audit",
                status: ia.status || "Planned"
            })),
            ...mgmtReviews.map(mr => ({
                id: `mr-${mr.id}`,
                title: "Management Review",
                date: mr.meetingDate,
                type: "Review",
                link: "/dashboard/iso14001",
                status: mr.status || "Planned"
            }))
        ]

        // Add waste storage deadlines
        const storedWasteAll = await db.query.wasteManifests.findMany();
        storedWasteAll.forEach(w => {
            const deadline = new Date(w.generatorDate.getTime() + (w.maxStorageDays || 90) * 24 * 60 * 60 * 1000);
            rawEvents.push({
                id: `waste-${w.id}`,
                title: `Waste Storage Limit: ${w.wasteType}`,
                date: deadline,
                type: "Waste",
                link: "/dashboard/waste",
                status: w.status === "stored" ? "Critical" : "Closed"
            });
        });

        // Add POPAL expiry
        const popal = await db.query.popalProfiles.findMany();
        popal.forEach(p => {
            rawEvents.push({
                id: `popal-${p.id}`,
                title: `POPAL Cert Expiry: ${p.name}`,
                date: p.validityEnd,
                type: "Certification",
                link: "/dashboard/wastewater",
                status: p.status || "Active"
            });
        });

        // Fix type mismatch by using a user-defined type guard
        const events = rawEvents.filter((e): e is CalendarEvent & { date: Date } => e.date !== null && e.date !== undefined);

        return events;
    } catch (error) {
        console.error("Calendar Events Error:", error);
        return [];
    }
}
