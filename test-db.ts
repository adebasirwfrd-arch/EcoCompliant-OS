import "dotenv/config";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import postgres from "postgres";
import * as schema from "./src/db/schema";

// Setup SQLite
const sqliteClient = createClient({ url: "file:local.db" });
const sqliteDb = drizzleSqlite(sqliteClient, { schema });

// Setup Supabase
const pgUrl = process.env.SUPABASE_DATABASE_URL;
if (!pgUrl) { console.error("Missing SUPABASE_DATABASE_URL"); process.exit(1); }
const pgClient = postgres(pgUrl);
const pgDb = drizzlePg(pgClient, { schema });

type TableEntry = { name: string; sqliteQuery: () => Promise<any[]>; pgQuery: () => Promise<any[]> };

const tables: TableEntry[] = [
    { name: "users", sqliteQuery: () => sqliteDb.query.users.findMany(), pgQuery: () => pgDb.query.users.findMany() },
    { name: "sessions", sqliteQuery: () => sqliteDb.query.sessions.findMany(), pgQuery: () => pgDb.query.sessions.findMany() },
    { name: "water_quality_logs", sqliteQuery: () => sqliteDb.query.waterQualityLogs.findMany(), pgQuery: () => pgDb.query.waterQualityLogs.findMany() },
    { name: "waste_manifests", sqliteQuery: () => sqliteDb.query.wasteManifests.findMany(), pgQuery: () => pgDb.query.wasteManifests.findMany() },
    { name: "compliance_reports", sqliteQuery: () => sqliteDb.query.complianceReports.findMany(), pgQuery: () => pgDb.query.complianceReports.findMany() },
    { name: "compliance_comments", sqliteQuery: () => sqliteDb.query.complianceComments.findMany(), pgQuery: () => pgDb.query.complianceComments.findMany() },
    { name: "simpel_records", sqliteQuery: () => sqliteDb.query.simpelRecords.findMany(), pgQuery: () => pgDb.query.simpelRecords.findMany() },
    { name: "rkab_submissions", sqliteQuery: () => sqliteDb.query.rkabSubmissions.findMany(), pgQuery: () => pgDb.query.rkabSubmissions.findMany() },
    { name: "ghg_emissions", sqliteQuery: () => sqliteDb.query.ghgEmissions.findMany(), pgQuery: () => pgDb.query.ghgEmissions.findMany() },
    { name: "amdal_milestones", sqliteQuery: () => sqliteDb.query.amdalMilestones.findMany(), pgQuery: () => pgDb.query.amdalMilestones.findMany() },
    { name: "amdal_requirements", sqliteQuery: () => sqliteDb.query.amdalRequirements.findMany(), pgQuery: () => pgDb.query.amdalRequirements.findMany() },
    { name: "iso_audits", sqliteQuery: () => sqliteDb.query.isoAudits.findMany(), pgQuery: () => pgDb.query.isoAudits.findMany() },
    { name: "audit_logs", sqliteQuery: () => sqliteDb.query.auditLogs.findMany(), pgQuery: () => pgDb.query.auditLogs.findMany() },
    { name: "proper_assessments", sqliteQuery: () => sqliteDb.query.properAssessments.findMany(), pgQuery: () => pgDb.query.properAssessments.findMany() },
    { name: "proper_inventory", sqliteQuery: () => sqliteDb.query.properInventory.findMany(), pgQuery: () => pgDb.query.properInventory.findMany() },
    { name: "proper_beyond_compliance", sqliteQuery: () => sqliteDb.query.properBeyondCompliance.findMany(), pgQuery: () => pgDb.query.properBeyondCompliance.findMany() },
    { name: "proper_criteria_results", sqliteQuery: () => sqliteDb.query.properCriteriaResults.findMany(), pgQuery: () => pgDb.query.properCriteriaResults.findMany() },
    { name: "proper_community_dev", sqliteQuery: () => sqliteDb.query.properCommunityDev.findMany(), pgQuery: () => pgDb.query.properCommunityDev.findMany() },
    { name: "popal_profiles", sqliteQuery: () => sqliteDb.query.popalProfiles.findMany(), pgQuery: () => pgDb.query.popalProfiles.findMany() },
    { name: "wastewater_logs", sqliteQuery: () => sqliteDb.query.wastewaterLogs.findMany(), pgQuery: () => pgDb.query.wastewaterLogs.findMany() },
    { name: "waste_partners", sqliteQuery: () => sqliteDb.query.wastePartners.findMany(), pgQuery: () => pgDb.query.wastePartners.findMany() },
    { name: "waste_sources", sqliteQuery: () => sqliteDb.query.wasteSources.findMany(), pgQuery: () => pgDb.query.wasteSources.findMany() },
    { name: "domestic_waste_logs", sqliteQuery: () => sqliteDb.query.domesticWasteLogs.findMany(), pgQuery: () => pgDb.query.domesticWasteLogs.findMany() },
    { name: "iso_context", sqliteQuery: () => sqliteDb.query.isoContext.findMany(), pgQuery: () => pgDb.query.isoContext.findMany() },
    { name: "iso_aspects", sqliteQuery: () => sqliteDb.query.isoAspects.findMany(), pgQuery: () => pgDb.query.isoAspects.findMany() },
    { name: "iso_legal_registry", sqliteQuery: () => sqliteDb.query.isoLegalRegistry.findMany(), pgQuery: () => pgDb.query.isoLegalRegistry.findMany() },
    { name: "iso_objectives", sqliteQuery: () => sqliteDb.query.isoObjectives.findMany(), pgQuery: () => pgDb.query.isoObjectives.findMany() },
    { name: "iso_risks", sqliteQuery: () => sqliteDb.query.isoRisks.findMany(), pgQuery: () => pgDb.query.isoRisks.findMany() },
    { name: "iso_capa", sqliteQuery: () => sqliteDb.query.isoCAPA.findMany(), pgQuery: () => pgDb.query.isoCAPA.findMany() },
    { name: "iso_interested_parties", sqliteQuery: () => sqliteDb.query.isoInterestedParties.findMany(), pgQuery: () => pgDb.query.isoInterestedParties.findMany() },
    { name: "iso_operational_controls", sqliteQuery: () => sqliteDb.query.isoOperationalControls.findMany(), pgQuery: () => pgDb.query.isoOperationalControls.findMany() },
    { name: "iso_emergency_prep", sqliteQuery: () => sqliteDb.query.isoEmergencyPrep.findMany(), pgQuery: () => pgDb.query.isoEmergencyPrep.findMany() },
    { name: "iso_performance_monitoring", sqliteQuery: () => sqliteDb.query.isoPerformanceMonitoring.findMany(), pgQuery: () => pgDb.query.isoPerformanceMonitoring.findMany() },
    { name: "iso_internal_audits", sqliteQuery: () => sqliteDb.query.isoInternalAudits.findMany(), pgQuery: () => pgDb.query.isoInternalAudits.findMany() },
    { name: "iso_management_reviews", sqliteQuery: () => sqliteDb.query.isoManagementReviews.findMany(), pgQuery: () => pgDb.query.isoManagementReviews.findMany() },
    { name: "esg_topics", sqliteQuery: () => sqliteDb.query.esgTopics.findMany(), pgQuery: () => pgDb.query.esgTopics.findMany() },
    { name: "esg_disclosures", sqliteQuery: () => sqliteDb.query.esgDisclosures.findMany(), pgQuery: () => pgDb.query.esgDisclosures.findMany() },
    { name: "esg_questions", sqliteQuery: () => sqliteDb.query.esgQuestions.findMany(), pgQuery: () => pgDb.query.esgQuestions.findMany() },
    { name: "esg_answers", sqliteQuery: () => sqliteDb.query.esgAnswers.findMany(), pgQuery: () => pgDb.query.esgAnswers.findMany() },
    { name: "esg_assessments", sqliteQuery: () => sqliteDb.query.esgAssessments.findMany(), pgQuery: () => pgDb.query.esgAssessments.findMany() },
];

async function check() {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("  📊 SQLite vs Supabase - Full Migration Comparison");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("");
    console.log(`${"Table".padEnd(30)} ${"SQLite".padStart(8)} ${"Supabase".padStart(10)} ${"Status".padStart(10)}`);
    console.log("─".repeat(62));

    let totalMismatch = 0;
    let totalMissing = 0;

    for (const t of tables) {
        try {
            const sqliteRows = await t.sqliteQuery();
            const pgRows = await t.pgQuery();
            const sqliteCount = sqliteRows.length;
            const pgCount = pgRows.length;

            let status = "✅ OK";
            if (sqliteCount !== pgCount) {
                if (sqliteCount > 0 && pgCount === 0) {
                    status = "❌ MISSING";
                    totalMissing++;
                } else {
                    status = "⚠️ DIFF";
                    totalMismatch++;
                }
            } else if (sqliteCount === 0 && pgCount === 0) {
                status = "⬜ EMPTY";
            }
            console.log(`${t.name.padEnd(30)} ${String(sqliteCount).padStart(8)} ${String(pgCount).padStart(10)} ${status.padStart(10)}`);
        } catch (e: any) {
            console.log(`${t.name.padEnd(30)} ${"?".padStart(8)} ${"?".padStart(10)} ❌ ERROR: ${e.message?.slice(0, 50)}`);
        }
    }

    console.log("─".repeat(62));
    if (totalMissing > 0) console.log(`❌ ${totalMissing} table(s) have data in SQLite but NOT in Supabase`);
    if (totalMismatch > 0) console.log(`⚠️  ${totalMismatch} table(s) have different row counts`);
    if (totalMissing === 0 && totalMismatch === 0) console.log("✅ All tables match perfectly!");
    console.log("");

    process.exit(0);
}

check();
