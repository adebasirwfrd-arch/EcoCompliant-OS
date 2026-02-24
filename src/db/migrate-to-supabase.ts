import "dotenv/config";
import { drizzle as drizzleSqlite } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 1. Setup SQLite Client
const sqliteClient = createClient({
    url: "file:local.db",
});
const sqliteDb = drizzleSqlite(sqliteClient, { schema });

// 2. Setup Supabase (PostgreSQL) Client
const pgUrl = process.env.SUPABASE_DATABASE_URL;
if (!pgUrl) {
    console.error("SUPABASE_DATABASE_URL is missing in .env");
    process.exit(1);
}

const pgClient = postgres(pgUrl);
const pgDb = drizzlePg(pgClient, { schema });

async function migrate() {
    console.log("🚀 Starting Complete Migration to Supabase...");

    try {
        // --- 1. Base Tables (No upstream dependencies) ---

        console.log("Migrating users...");
        const users = await sqliteDb.query.users.findMany();
        if (users.length > 0) await pgDb.insert(schema.users).values(users).onConflictDoNothing();

        console.log("Migrating waste partners...");
        const partners = await sqliteDb.query.wastePartners.findMany();
        if (partners.length > 0) await pgDb.insert(schema.wastePartners).values(partners).onConflictDoNothing();

        console.log("Migrating waste sources...");
        const sources = await sqliteDb.query.wasteSources.findMany();
        if (sources.length > 0) await pgDb.insert(schema.wasteSources).values(sources).onConflictDoNothing();

        console.log("Migrating popal profiles...");
        const popal = await sqliteDb.query.popalProfiles.findMany();
        if (popal.length > 0) {
            await pgDb.insert(schema.popalProfiles).values(popal.map(p => ({
                ...p,
                validityStart: new Date(p.validityStart),
                validityEnd: new Date(p.validityEnd)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ESG topics...");
        const esgTopics = await sqliteDb.query.esgTopics.findMany();
        if (esgTopics.length > 0) await pgDb.insert(schema.esgTopics).values(esgTopics).onConflictDoNothing();

        console.log("Migrating audit logs...");
        const auditLogs = await sqliteDb.query.auditLogs.findMany();
        if (auditLogs.length > 0) {
            await pgDb.insert(schema.auditLogs).values(auditLogs.map(l => ({
                ...l,
                timestamp: new Date(l.timestamp)
            }))).onConflictDoNothing();
        }

        // --- 2. Phase 1 Dependencies (Depends on Base Tables) ---

        console.log("Migrating sessions...");
        const sessions = await sqliteDb.query.sessions.findMany();
        if (sessions.length > 0) {
            await pgDb.insert(schema.sessions).values(sessions.map(s => ({
                ...s,
                expiresAt: new Date(s.expiresAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ESG disclosures...");
        const esgDisc = await sqliteDb.query.esgDisclosures.findMany();
        if (esgDisc.length > 0) await pgDb.insert(schema.esgDisclosures).values(esgDisc).onConflictDoNothing();

        console.log("Migrating compliance reports...");
        const reports = await sqliteDb.query.complianceReports.findMany();
        if (reports.length > 0) {
            await pgDb.insert(schema.complianceReports).values(reports.map(r => ({
                ...r,
                dueDate: new Date(r.dueDate),
                submissionDate: r.submissionDate ? new Date(r.submissionDate) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating proper assessments...");
        const proper = await sqliteDb.query.properAssessments.findMany();
        if (proper.length > 0) {
            await pgDb.insert(schema.properAssessments).values(proper.map(p => ({
                ...p,
                createdAt: new Date(p.createdAt),
                updatedAt: new Date(p.updatedAt),
                verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : null
            }))).onConflictDoNothing();
        }

        // --- 3. Phase 2 Dependencies ---

        console.log("Migrating ESG questions...");
        const esgQue = await sqliteDb.query.esgQuestions.findMany();
        if (esgQue.length > 0) await pgDb.insert(schema.esgQuestions).values(esgQue).onConflictDoNothing();

        console.log("Migrating simpel records...");
        const simpel = await sqliteDb.query.simpelRecords.findMany();
        if (simpel.length > 0) {
            await pgDb.insert(schema.simpelRecords).values(simpel.map(s => ({
                ...s,
                lastSyncDate: s.lastSyncDate ? new Date(s.lastSyncDate) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating rkab submissions...");
        const rkab = await sqliteDb.query.rkabSubmissions.findMany();
        if (rkab.length > 0) await pgDb.insert(schema.rkabSubmissions).values(rkab).onConflictDoNothing();

        console.log("Migrating compliance comments...");
        const comments = await sqliteDb.query.complianceComments.findMany();
        if (comments.length > 0) {
            await pgDb.insert(schema.complianceComments).values(comments.map(c => ({
                ...c,
                createdAt: new Date(c.createdAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating proper inventory...");
        const inventory = await sqliteDb.query.properInventory.findMany();
        if (inventory.length > 0) await pgDb.insert(schema.properInventory).values(inventory).onConflictDoNothing();

        console.log("Migrating proper beyond compliance...");
        const beyond = await sqliteDb.query.properBeyondCompliance.findMany();
        if (beyond.length > 0) await pgDb.insert(schema.properBeyondCompliance).values(beyond).onConflictDoNothing();

        console.log("Migrating proper criteria results...");
        const criteria = await sqliteDb.query.properCriteriaResults.findMany();
        if (criteria.length > 0) {
            await pgDb.insert(schema.properCriteriaResults).values(criteria.map(c => ({
                ...c,
                updatedAt: c.updatedAt ? new Date(c.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating proper community dev...");
        const commDev = await sqliteDb.query.properCommunityDev.findMany();
        if (commDev.length > 0) {
            await pgDb.insert(schema.properCommunityDev).values(commDev.map(c => ({
                ...c,
                updatedAt: c.updatedAt ? new Date(c.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ESG assessments...");
        const esgAss = await sqliteDb.query.esgAssessments.findMany();
        if (esgAss.length > 0) {
            await pgDb.insert(schema.esgAssessments).values(esgAss.map(a => ({
                ...a,
                createdAt: new Date(a.createdAt),
                updatedAt: new Date(a.updatedAt)
            }))).onConflictDoNothing();
        }

        // --- 4. Final Tables & Operational Data ---

        console.log("Migrating ESG answers...");
        const esgAns = await sqliteDb.query.esgAnswers.findMany();
        if (esgAns.length > 0) {
            await pgDb.insert(schema.esgAnswers).values(esgAns.map(a => ({
                ...a,
                updatedAt: new Date(a.updatedAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating water quality logs...");
        const waterLogs = await sqliteDb.query.waterQualityLogs.findMany();
        if (waterLogs.length > 0) {
            await pgDb.insert(schema.waterQualityLogs).values(waterLogs.map(l => ({
                ...l,
                timestamp: new Date(l.timestamp)
            }))).onConflictDoNothing();
        }

        console.log("Migrating wastewater logs...");
        const wastewaterLogs = await sqliteDb.query.wastewaterLogs.findMany();
        if (wastewaterLogs.length > 0) {
            await pgDb.insert(schema.wastewaterLogs).values(wastewaterLogs.map(l => ({
                ...l,
                logDate: new Date(l.logDate)
            }))).onConflictDoNothing();
        }

        console.log("Migrating domestic waste logs...");
        const domesticLogs = await sqliteDb.query.domesticWasteLogs.findMany();
        if (domesticLogs.length > 0) {
            await pgDb.insert(schema.domesticWasteLogs).values(domesticLogs.map(l => ({
                ...l,
                date: new Date(l.date),
                createdAt: new Date(l.createdAt),
                updatedAt: new Date(l.updatedAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating waste manifests...");
        const manifests = await sqliteDb.query.wasteManifests.findMany();
        if (manifests.length > 0) {
            await pgDb.insert(schema.wasteManifests).values(manifests.map(m => ({
                ...m,
                generatorDate: new Date(m.generatorDate),
                createdAt: new Date(m.createdAt),
                updatedAt: new Date(m.updatedAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating GHG emissions...");
        const ghg = await sqliteDb.query.ghgEmissions.findMany();
        if (ghg.length > 0) {
            await pgDb.insert(schema.ghgEmissions).values(ghg.map(g => ({
                ...g,
                date: new Date(g.date)
            }))).onConflictDoNothing();
        }

        console.log("Migrating AMDAL milestones...");
        const milestones = await sqliteDb.query.amdalMilestones.findMany();
        if (milestones.length > 0) await pgDb.insert(schema.amdalMilestones).values(milestones).onConflictDoNothing();

        console.log("Migrating AMDAL requirements...");
        const reqs = await sqliteDb.query.amdalRequirements.findMany();
        if (reqs.length > 0) {
            await pgDb.insert(schema.amdalRequirements).values(reqs.map(r => ({
                ...r,
                lastMonitoredDate: r.lastMonitoredDate ? new Date(r.lastMonitoredDate) : null,
                nextDueDate: new Date(r.nextDueDate)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO audits...");
        const isoAudits = await sqliteDb.query.isoAudits.findMany();
        if (isoAudits.length > 0) {
            await pgDb.insert(schema.isoAudits).values(isoAudits.map(a => ({
                ...a,
                auditDate: new Date(a.auditDate)
            }))).onConflictDoNothing();
        }

        // --- ISO EMS Tables ---
        console.log("Migrating ISO context...");
        const context = await sqliteDb.query.isoContext.findMany();
        if (context.length > 0) {
            await pgDb.insert(schema.isoContext).values(context.map(c => ({
                ...c,
                updatedAt: new Date(c.updatedAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO aspects...");
        const aspects = await sqliteDb.query.isoAspects.findMany();
        if (aspects.length > 0) {
            await pgDb.insert(schema.isoAspects).values(aspects.map(a => ({
                ...a,
                updatedAt: new Date(a.updatedAt)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO legal registry...");
        const registry = await sqliteDb.query.isoLegalRegistry.findMany();
        if (registry.length > 0) {
            await pgDb.insert(schema.isoLegalRegistry).values(registry.map(r => ({
                ...r,
                lastReviewDate: r.lastReviewDate ? new Date(r.lastReviewDate) : null,
                nextReviewDate: r.nextReviewDate ? new Date(r.nextReviewDate) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO objectives...");
        const objectives = await sqliteDb.query.isoObjectives.findMany();
        if (objectives.length > 0) {
            await pgDb.insert(schema.isoObjectives).values(objectives.map(o => ({
                ...o,
                deadline: new Date(o.deadline)
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO risks...");
        const risks = await sqliteDb.query.isoRisks.findMany();
        if (risks.length > 0) await pgDb.insert(schema.isoRisks).values(risks).onConflictDoNothing();

        console.log("Migrating ISO CAPA...");
        const capa = await sqliteDb.query.isoCAPA.findMany();
        if (capa.length > 0) {
            await pgDb.insert(schema.isoCAPA).values(capa.map(c => ({
                ...c,
                dueDate: new Date(c.dueDate),
                closedDate: c.closedDate ? new Date(c.closedDate) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO interested parties...");
        const parties = await sqliteDb.query.isoInterestedParties.findMany();
        if (parties.length > 0) {
            await pgDb.insert(schema.isoInterestedParties).values(parties.map(p => ({
                ...p,
                updatedAt: p.updatedAt ? new Date(p.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO operational controls...");
        const controls = await sqliteDb.query.isoOperationalControls.findMany();
        if (controls.length > 0) {
            await pgDb.insert(schema.isoOperationalControls).values(controls.map(c => ({
                ...c,
                updatedAt: c.updatedAt ? new Date(c.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO emergency prep...");
        const emer = await sqliteDb.query.isoEmergencyPrep.findMany();
        if (emer.length > 0) {
            await pgDb.insert(schema.isoEmergencyPrep).values(emer.map(e => ({
                ...e,
                lastDrillDate: e.lastDrillDate ? new Date(e.lastDrillDate) : null,
                nextDrillDate: e.nextDrillDate ? new Date(e.nextDrillDate) : null,
                updatedAt: e.updatedAt ? new Date(e.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO performance monitoring...");
        const perf = await sqliteDb.query.isoPerformanceMonitoring.findMany();
        if (perf.length > 0) {
            await pgDb.insert(schema.isoPerformanceMonitoring).values(perf.map(p => ({
                ...p,
                updatedAt: p.updatedAt ? new Date(p.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO internal audits...");
        const intAudits = await sqliteDb.query.isoInternalAudits.findMany();
        if (intAudits.length > 0) {
            await pgDb.insert(schema.isoInternalAudits).values(intAudits.map(a => ({
                ...a,
                auditDate: new Date(a.auditDate),
                updatedAt: a.updatedAt ? new Date(a.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("Migrating ISO management reviews...");
        const reviews = await sqliteDb.query.isoManagementReviews.findMany();
        if (reviews.length > 0) {
            await pgDb.insert(schema.isoManagementReviews).values(reviews.map(r => ({
                ...r,
                meetingDate: new Date(r.meetingDate),
                updatedAt: r.updatedAt ? new Date(r.updatedAt) : null
            }))).onConflictDoNothing();
        }

        console.log("✅ Complete Migration Finished Successfully!");
    } catch (error) {
        console.error("❌ Migration Failed:", error);
    } finally {
        process.exit(0);
    }
}

migrate();
