import { pgTable, text, integer, doublePrecision, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull(),
    image: text("image"),
    role: text("role").$type<"admin" | "specialist" | "supervisor" | "auditor">().default("specialist"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
}, (table) => ({
    userIdIdx: index("user_id_idx").on(table.userId),
}));

export const waterQualityLogs = pgTable("water_quality_logs", {
    id: text("id").primaryKey(),
    locationId: text("location_id").notNull(),
    parameter: text("parameter").notNull(),
    value: doublePrecision("value").notNull(),
    unit: text("unit").notNull(),
    timestamp: timestamp("timestamp").notNull(),
    recordedBy: text("recorded_by").references(() => users.id),
    isViolation: boolean("is_violation").default(false),
});

export const wasteManifests = pgTable("waste_manifests", {
    id: text("id").primaryKey(),
    manifestNumber: text("manifest_number"),
    festronikId: text("festronik_id"), // Official Festronik ID
    wasteCode: text("waste_code").notNull().default(""),
    wasteCategory: text("waste_category").$type<"1" | "2">().notNull().default("2"),
    wasteType: text("waste_type").notNull(),
    weight: doublePrecision("weight").notNull(),
    unit: text("unit").default("ton"),
    generatorDate: timestamp("generator_date").notNull(),
    maxStorageDays: integer("max_storage_days").notNull().default(90),

    // Transport & Destination
    transporterName: text("transporter_name"),
    transporterLicense: text("transporter_license"),
    vehiclePlate: text("vehicle_plate"),
    destinationFacility: text("destination_facility"),

    // Handling Method (Ref: Siraja)
    handlingMethod: text("handling_method").$type<"Recycle" | "Recovery" | "Incineration" | "Landfill" | "Export" | "Other">(),

    managerEmail: text("manager_email"),
    status: text("status").$type<"stored" | "transported" | "processed">().default("stored"),
    notes: text("notes"),
    fileUrl: text("file_url"), // For manifest evidence photos/PDFs
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const complianceReports = pgTable("compliance_reports", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    agency: text("agency").notNull(),
    category: text("category").$type<"RKAB" | "SIMPEL" | "RKL-RPL" | "UKL-UPL" | "Other">().default("Other"),
    periodYear: integer("period_year"),
    periodValue: text("period_value"), // e.g. 'Q1', 'H1', 'Jan'
    priority: text("priority").$type<"Low" | "Medium" | "High" | "Urgent">().default("Medium"),
    status: text("status").$type<"Pending" | "Submitted" | "Approved" | "Rejected">().default("Pending"),
    dueDate: timestamp("due_date").notNull(),
    submissionDate: timestamp("submission_date"),
    assignedTo: text("assigned_to").references(() => users.id),
    description: text("description"),
    remarks: text("remarks"),
    attachmentUrl: text("attachment_url"),
    managerEmail: text("manager_email"),
});

export const simpelRecords = pgTable("simpel_records", {
    id: text("id").primaryKey(),
    reportId: text("report_id").notNull().references(() => complianceReports.id, { onDelete: 'cascade' }),
    properRating: text("proper_rating").$type<"GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK">().default("BLUE"),
    waterStatus: text("water_status").$type<"Compliant" | "Non-Compliant" | "N/A">().default("Compliant"),
    airStatus: text("air_status").$type<"Compliant" | "Non-Compliant" | "N/A">().default("Compliant"),
    wasteStatus: text("waste_status").$type<"Compliant" | "Non-Compliant" | "N/A">().default("Compliant"),
    lastSyncDate: timestamp("last_sync_date"),
});

export const rkabSubmissions = pgTable("rkab_submissions", {
    id: text("id").primaryKey(),
    reportId: text("report_id").notNull().references(() => complianceReports.id, { onDelete: 'cascade' }),
    year: integer("year").notNull(),
    productionTarget: doublePrecision("production_target"), // e.g. tons
    salesTarget: doublePrecision("sales_target"),
    explorationCost: doublePrecision("exploration_cost"),
    environmentalBudget: doublePrecision("environmental_budget"),
    technicalDocLink: text("technical_doc_link"),
});

export const complianceComments = pgTable("compliance_comments", {
    id: text("id").primaryKey(),
    reportId: text("report_id").notNull().references(() => complianceReports.id),
    userId: text("user_id").notNull().references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull(),
});

// --- GHG EMISSIONS (PHASE 4) ---
export const ghgEmissions = pgTable("ghg_emissions", {
    id: text("id").primaryKey(),
    date: timestamp("date").notNull(),
    scope: integer("scope").notNull(), // 1, 2, or 3
    category: text("category").notNull(), // e.g., Stationary Combustion, Purchased Electricity
    source: text("source").notNull(), // e.g., Genset 1, PLN Grid
    value: doublePrecision("value").notNull(), // e.g., 500 (liters of fuel, kWh)
    unit: text("unit").notNull(), // e.g., Liters, kWh, kg
    emissionFactor: doublePrecision("emission_factor").notNull(), // e.g., 2.68 (kg CO2/Liter)
    co2e: doublePrecision("co2e").notNull(), // Calculated total (tCO2e)
    notes: text("notes"),
    evidenceUrl: text("evidence_url"),
});

export const amdalMilestones = pgTable("amdal_milestones", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    status: text("status").$type<"Pending" | "In Progress" | "Completed">().default("Pending"),
    progress: integer("progress").default(0),
    description: text("description"),
});

export const amdalRequirements = pgTable("amdal_requirements", {
    id: text("id").primaryKey(),
    documentType: text("document_type").$type<"AMDAL" | "UKL-UPL" | "SPPL" | "DELH">().default("AMDAL"),
    parameter: text("parameter").notNull(), // e.g., Air Quality, Noise, Social Economic
    type: text("type").$type<"RKL" | "RPL">().default("RPL"), // RKL (Management) or RPL (Monitoring)
    frequency: text("frequency").$type<"Daily" | "Monthly" | "Quarterly" | "Semester" | "Annual">().notNull(),
    lastMonitoredDate: timestamp("last_monitored_date"),
    nextDueDate: timestamp("next_due_date").notNull(),
    status: text("status").$type<"Compliant" | "Non-Compliant" | "Pending">().default("Pending"),
    pic: text("pic"),
});

export const isoAudits = pgTable("iso_audits", {
    id: text("id").primaryKey(),
    auditType: text("audit_type").notNull(),
    auditDate: timestamp("audit_date").notNull(),
    findingsCount: integer("findings_count").default(0),
    status: text("status").$type<"Scheduled" | "In Progress" | "Closed">().default("Scheduled"),
});

export const auditLogs = pgTable("audit_logs", {
    id: text("id").primaryKey(),
    action: text("action").notNull(), // 'CREATE' | 'UPDATE' | 'DELETE'
    entity: text("entity").notNull(),
    entityId: text("entity_id").notNull(),
    details: text("details"),
    performedBy: text("performed_by"),
    timestamp: timestamp("timestamp").notNull(),
});

export const properAssessments = pgTable("proper_assessments", {
    id: text("id").primaryKey(),
    year: integer("year").notNull(),
    status: text("status").$type<"Draft" | "Self-Assessed" | "Verified">().default("Draft"),
    predictedRating: text("predicted_rating").$type<"GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK">(),
    finalRating: text("final_rating").$type<"GOLD" | "GREEN" | "BLUE" | "RED" | "BLACK">(),
    verifiedAt: timestamp("verified_at"),
    verifiedBy: text("verified_by").references(() => users.id),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const properInventory = pgTable("proper_inventory", {
    id: text("id").primaryKey(),
    assessmentId: text("assessment_id").notNull().references(() => properAssessments.id, { onDelete: 'cascade' }),
    waterQualityScore: doublePrecision("water_quality_score").default(0),
    airQualityScore: doublePrecision("air_quality_score").default(0),
    hazardousWasteScore: doublePrecision("hazardous_waste_score").default(0),
    landQualityScore: doublePrecision("land_quality_score").default(0),
    complianceLevel: text("compliance_level").$type<"Full" | "Partial" | "None">().default("None"),
});

export const properBeyondCompliance = pgTable("proper_beyond_compliance", {
    id: text("id").primaryKey(),
    assessmentId: text("assessment_id").notNull().references(() => properAssessments.id, { onDelete: 'cascade' }),
    energyEfficiencyScore: doublePrecision("energy_efficiency_score").default(0),
    waterConservationScore: doublePrecision("water_conservation_score").default(0),
    biodiversityScore: doublePrecision("biodiversity_score").default(0),
    emissionReductionScore: doublePrecision("emission_reduction_score").default(0),
    socialInnovationScore: doublePrecision("social_innovation_score").default(0),
});

// --- Relations ---

export const complianceReportsRelations = relations(complianceReports, ({ one, many }) => ({
    comments: many(complianceComments),
    simpelRecord: one(simpelRecords, {
        fields: [complianceReports.id],
        references: [simpelRecords.reportId],
    }),
    rkabSubmission: one(rkabSubmissions, {
        fields: [complianceReports.id],
        references: [rkabSubmissions.reportId],
    }),
}));

export const simpelRecordsRelations = relations(simpelRecords, ({ one }) => ({
    report: one(complianceReports, {
        fields: [simpelRecords.reportId],
        references: [complianceReports.id],
    }),
}));

export const rkabSubmissionsRelations = relations(rkabSubmissions, ({ one }) => ({
    report: one(complianceReports, {
        fields: [rkabSubmissions.reportId],
        references: [complianceReports.id],
    }),
}));

export const complianceCommentsRelations = relations(complianceComments, ({ one }) => ({
    report: one(complianceReports, {
        fields: [complianceComments.reportId],
        references: [complianceReports.id],
    }),
    user: one(users, {
        fields: [complianceComments.userId],
        references: [users.id],
    }),
}));

export const properAssessmentsRelations = relations(properAssessments, ({ one }) => ({
    inventory: one(properInventory, {
        fields: [properAssessments.id],
        references: [properInventory.assessmentId],
    }),
    beyondCompliance: one(properBeyondCompliance, {
        fields: [properAssessments.id],
        references: [properBeyondCompliance.assessmentId],
    }),
}));

export const properInventoryRelations = relations(properInventory, ({ one }) => ({
    assessment: one(properAssessments, {
        fields: [properInventory.assessmentId],
        references: [properAssessments.id],
    }),
}));

export const properBeyondComplianceRelations = relations(properBeyondCompliance, ({ one }) => ({
    assessment: one(properAssessments, {
        fields: [properBeyondCompliance.assessmentId],
        references: [properAssessments.id],
    }),
}));

// --- WASTEWATER (AIR LIMBAH) & POPAL ---
export const popalProfiles = pgTable("popal_profiles", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    certificationNumber: text("certification_number").notNull(),
    certifiedBy: text("certified_by").notNull().default("BNSP"), // e.g., BNSP
    validityStart: timestamp("validity_start").notNull(),
    validityEnd: timestamp("validity_end").notNull(),
    status: text("status").$type<"active" | "expired" | "revoked">().default("active"),
    companyId: text("company_id").default("DEFAULT_COMPANY"),
    profileImageUrl: text("profile_image_url"),
});

export const wastewaterLogs = pgTable("wastewater_logs", {
    id: text("id").primaryKey(),
    logDate: timestamp("log_date").notNull(),
    phLevel: doublePrecision("ph_level").notNull(), // Typical BMAL: 6-9
    codLevel: doublePrecision("cod_level").notNull(), // Dependent on industry (e.g. 100 mg/L)
    bodLevel: doublePrecision("bod_level").notNull(), // Dependent on industry (e.g. 50 mg/L)
    tssLevel: doublePrecision("tss_level").notNull(), // Dependent on industry (e.g. 50 mg/L)
    ammoniaLevel: doublePrecision("ammonia_level").notNull(),
    debitOutfall: doublePrecision("debit_outfall").notNull(), // m3/day
    popalId: text("popal_id").references(() => popalProfiles.id, { onDelete: 'set null' }),
    notes: text("notes"),
    isViolation: boolean("is_violation").default(false), // Auto-flagged by system
});

// --- ISO 14001:2015 SUPER GOD-TIER (PHASE 6) ---

export const isoContext = pgTable("iso_context", {
    id: text("id").primaryKey(),
    type: text("type").$type<"Internal" | "External" | "Interested Party">().notNull(),
    issue: text("issue").notNull(),
    requirement: text("requirement"), // For Interested Parties
    impact: text("impact"),
    strategy: text("strategy"),
    status: text("status").$type<"Active" | "Archived">().default("Active"),
    updatedAt: timestamp("updated_at").notNull(),
});

export const isoAspects = pgTable("iso_aspects", {
    id: text("id").primaryKey(),
    activity: text("activity").notNull(),
    aspect: text("aspect").notNull(),
    impact: text("impact").notNull(),
    condition: text("condition").$type<"Normal" | "Abnormal" | "Emergency">().default("Normal"),

    // Significance Scoring
    severity: integer("severity").notNull(), // 1-5
    probability: integer("probability").notNull(), // 1-5
    significanceScore: integer("significance_score").notNull(), // severity * probability
    isSignificant: boolean("is_significant").notNull(),

    controlMeasures: text("control_measures"),
    status: text("status").$type<"Active" | "Mitigated" | "Archived">().default("Active"),
    updatedAt: timestamp("updated_at").notNull(),
});

export const isoLegalRegistry = pgTable("iso_legal_registry", {
    id: text("id").primaryKey(),
    regulationName: text("id_regulation").notNull(),
    clause: text("clause"),
    summary: text("summary"),
    relevance: text("relevance").notNull(),
    complianceStatus: text("compliance_status").$type<"Compliant" | "Non-Compliant" | "N/A">().default("Compliant"),
    lastReviewDate: timestamp("last_review_date"),
    nextReviewDate: timestamp("next_review_date"),
    evidenceUrl: text("evidence_url"),
});

export const isoObjectives = pgTable("iso_objectives", {
    id: text("id").primaryKey(),
    objective: text("objective").notNull(),
    targetValue: text("target_value").notNull(),
    indicator: text("indicator").notNull(), // e.g., kg/unit
    baseline: text("baseline"),
    progress: integer("progress").default(0),
    deadline: timestamp("deadline").notNull(),
    department: text("department"),
    pic: text("pic"),
    status: text("status").$type<"On Track" | "At Risk" | "Canceled" | "Achieved">().default("On Track"),
});

export const isoRisks = pgTable("iso_risks", {
    id: text("id").primaryKey(),
    source: text("source").notNull(), // e.g., Aspect, Context, Compliance
    description: text("description").notNull(),
    potentialImpact: text("potential_impact"),
    riskLevel: text("risk_level").$type<"Low" | "Medium" | "High" | "Critical">().notNull(),
    mitigationPlan: text("mitigation_plan"),
    residualRisk: text("residual_risk").$type<"Low" | "Medium" | "High" | "Critical">(),
    status: text("status").$type<"Open" | "Mitigated" | "Closed">().default("Open"),
});

export const isoCAPA = pgTable("iso_capa", {
    id: text("id").primaryKey(),
    source: text("source").notNull(), // e.g., Internal Audit, External Audit, Incident
    description: text("description").notNull(),
    ncType: text("nc_type").$type<"Major" | "Minor" | "OFI">().notNull(),
    rootCause: text("root_cause"),
    correctiveAction: text("corrective_action"),
    preventiveAction: text("preventive_action"),
    dueDate: timestamp("due_date").notNull(),
    closedDate: timestamp("closed_date"),
    status: text("status").$type<"Open" | "Verified" | "Closed">().default("Open"),
    pic: text("pic"),
});

// --- ISO 14001:2015 EXTENDED EMS TABLES ---

// Clause 4.2: Interested Parties
export const isoInterestedParties = pgTable("iso_interested_parties", {
    id: text("id").primaryKey(),
    party: text("party").notNull(), // e.g. Government, Local Community, Employees
    needs: text("needs"), // What they expect
    expectations: text("expectations"),
    isLegalObligation: boolean("is_legal_obligation").default(false),
    status: text("status").$type<"Active" | "Archived">().default("Active"),
    updatedAt: timestamp("updated_at"),
});

// Clause 8.1: Operational Controls (OCP)
export const isoOperationalControls = pgTable("iso_operational_controls", {
    id: text("id").primaryKey(),
    procedureName: text("procedure_name").notNull(),
    description: text("description"),
    department: text("department"),
    aspectLink: text("aspect_link"), // Reference to an ISO Aspect ID
    controlMethod: text("control_method").$type<"Engineering" | "Administrative" | "PPE" | "Elimination">(),
    frequency: text("frequency"),
    pic: text("pic"),
    documentUrl: text("document_url"),
    updatedAt: timestamp("updated_at"),
});

// Clause 8.2: Emergency Preparedness
export const isoEmergencyPrep = pgTable("iso_emergency_prep", {
    id: text("id").primaryKey(),
    scenario: text("scenario").notNull(), // e.g. Fire, Massive Chemical Spill
    responsePlan: text("response_plan"),
    equipmentRequired: text("equipment_required"),
    lastDrillDate: timestamp("last_drill_date"),
    nextDrillDate: timestamp("next_drill_date"),
    drillOutcome: text("drill_outcome"),
    status: text("status").$type<"Ready" | "Action Required" | "Reviewing">().default("Ready"),
    updatedAt: timestamp("updated_at"),
});

// Clause 9.1: Performance Monitoring
export const isoPerformanceMonitoring = pgTable("iso_performance_monitoring", {
    id: text("id").primaryKey(),
    indicatorName: text("indicator_name").notNull(), // e.g. Water consumption per ton product
    parameter: text("parameter"),
    unit: text("unit"),
    baselineValue: doublePrecision("baseline_value"),
    targetValue: doublePrecision("target_value"),
    currentValue: doublePrecision("current_value"),
    frequency: text("frequency"),
    status: text("status").$type<"On Track" | "At Risk" | "Improving">().default("On Track"),
    updatedAt: timestamp("updated_at"),
});

// Clause 9.2: Internal Audits
export const isoInternalAudits = pgTable("iso_internal_audits", {
    id: text("id").primaryKey(),
    auditTitle: text("audit_title").notNull(),
    auditDate: timestamp("audit_date").notNull(),
    auditorName: text("auditor_name"),
    scope: text("scope"),
    findingsSummary: text("findings_summary"),
    majorNC: integer("major_nc").default(0),
    minorNC: integer("minor_nc").default(0),
    ofi: integer("ofi").default(0), // Opportunities for Improvement
    status: text("status").$type<"Planned" | "In Progress" | "Completed" | "Closed">().default("Planned"),
    reportUrl: text("report_url"),
    updatedAt: timestamp("updated_at"),
});

// Clause 9.3: Management Reviews
export const isoManagementReviews = pgTable("iso_management_reviews", {
    id: text("id").primaryKey(),
    meetingDate: timestamp("meeting_date").notNull(),
    chairperson: text("chairperson"),
    attendees: text("attendees"),
    reviewInputs: text("review_inputs"),
    decisionsAndActions: text("decisions_and_actions"),
    status: text("status").$type<"Planned" | "Completed" | "Follow-up Required">().default("Completed"),
    updatedAt: timestamp("updated_at"),
});

// --- PROPER GOD-TIER (PHASE 7) ---

export const properCriteriaResults = pgTable("proper_criteria_results", {
    id: text("id").primaryKey(),
    assessmentId: text("assessment_id").notNull().references(() => properAssessments.id, { onDelete: 'cascade' }),
    category: text("category").$type<"Air" | "Water" | "B3 Waste" | "Land" | "Energy" | "Biodiversity" | "Global Warming">().notNull(),
    parameter: text("parameter").notNull(), // e.g. Stack Emission Monitoring, Energy Efficiency Policy
    fulfillment: text("fulfillment").$type<"Yes" | "No" | "N/A">().default("No"),
    score: doublePrecision("score").default(0),
    evidenceUrl: text("evidence_url"),
    remarks: text("remarks"),
    updatedAt: timestamp("updated_at"),
});

export const properCommunityDev = pgTable("proper_community_dev", {
    id: text("id").primaryKey(),
    assessmentId: text("assessment_id").notNull().references(() => properAssessments.id, { onDelete: 'cascade' }),
    programName: text("program_name").notNull(),
    budget: doublePrecision("budget").default(0),
    beneficiaries: integer("beneficiaries").default(0),
    sroiScore: doublePrecision("sroi_score"), // Social Return on Investment
    innovationType: text("innovation_type").$type<"Process" | "Product" | "Social">(),
    status: text("status").$type<"Planned" | "Active" | "Completed">().default("Active"),
    updatedAt: timestamp("updated_at"),
});

export const properCriteriaResultsRelations = relations(properCriteriaResults, ({ one }) => ({
    assessment: one(properAssessments, {
        fields: [properCriteriaResults.assessmentId],
        references: [properAssessments.id],
    }),
}));

export const properCommunityDevRelations = relations(properCommunityDev, ({ one }) => ({
    assessment: one(properAssessments, {
        fields: [properCommunityDev.assessmentId],
        references: [properAssessments.id],
    }),
}));

// --- DOMESTIC WASTE (NON-B3) ---

export const domesticWasteLogs = pgTable("domestic_waste_logs", {
    id: text("id").primaryKey(),
    date: timestamp("date").notNull(),
    category: text("category").$type<"Organik" | "Anorganik (Plastik)" | "Anorganik (Kertas)" | "Anorganik (Logam/Kaca)" | "Residu">().notNull(),
    sourceId: text("source_id").references(() => wasteSources.id), // Reference to dynamic sources
    weight: doublePrecision("weight"), // Optional if using volume
    volume: doublePrecision("volume"), // Optional if using weight
    unit: text("unit").$type<"kg" | "m3">().default("kg"),
    vehiclePlate: text("vehicle_plate"), // Track vehicle per log
    destinationId: text("destination_id").references(() => wastePartners.id),
    status: text("status").$type<"Stored" | "Transported" | "Processed">().default("Stored"),
    evidenceUrl: text("evidence_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const wastePartners = pgTable("waste_partners", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    type: text("type").$type<"Recycler" | "TPS3R" | "Landfill" | "Collector">().notNull(),
    licenseNumber: text("license_number"),
    address: text("address"),
    contactPerson: text("contact_person"),
    phone: text("phone"),
    vehiclePlate: text("vehicle_plate"), // Fixed vehicle for partner if applicable
    status: text("status").$type<"Active" | "Inactive">().default("Active"),
});

export const wasteSources = pgTable("waste_sources", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location"),
    status: text("status").$type<"Active" | "Inactive">().default("Active"),
});

// --- ESG MATURITY ASSESSMENT (OCEAN CALM REFACTOR - GRI 11) ---

export const esgTopics = pgTable("esg_topics", {
    id: text("id").primaryKey(), // e.g. "11.1"
    name: text("name").notNull(), // e.g. "Climate Change"
    description: text("description"),
    pillar: text("pillar").$type<"Climate" | "Safety" | "Community" | "Governance">().notNull(),
    order: integer("order").notNull(),
});

export const esgDisclosures = pgTable("esg_disclosures", {
    id: text("id").primaryKey(), // e.g. "11.1.1" or "GRI 3-3"
    topicId: text("topic_id").notNull().references(() => esgTopics.id),
    name: text("name").notNull(),
    reference: text("reference"), // e.g. "GRI 3-3"
});

export const esgQuestions = pgTable("esg_questions", {
    id: text("id").primaryKey(),
    disclosureId: text("disclosure_id").notNull().references(() => esgDisclosures.id),
    text: text("text").notNull(),
    type: text("type").$type<"maturity">().default("maturity"), // For 0-3 scale
});

export const esgAnswers = pgTable("esg_answers", {
    id: text("id").primaryKey(),
    assessmentId: text("assessment_id").notNull().references(() => esgAssessments.id, { onDelete: 'cascade' }),
    questionId: text("question_id").notNull().references(() => esgQuestions.id),
    maturityScore: integer("maturity_score").notNull().default(0), // 0-3
    evidenceUrl: text("evidence_url"),
    remarks: text("remarks"),
    updatedAt: timestamp("updated_at").notNull(),
});

export const esgAssessments = pgTable("esg_assessments", {
    id: text("id").primaryKey(),
    year: integer("year").notNull(),
    title: text("title"),
    companyName: text("company_name"),
    organizationType: text("organization_type"),
    sector: text("sector").default("Oil & Gas"),
    reportingPeriod: text("reporting_period"), // e.g., "Jan 2026 - Dec 2026"
    contactPoint: text("contact_point"),
    picName: text("pic_name"),
    picEmail: text("pic_email"),
    overallScore: doublePrecision("overall_score").default(0),
    maturityLevel: text("maturity_level"), // e.g., Initial, Managed, Define, Strategic, Optimized
    status: text("status").$type<"Draft" | "Completed">().default("Draft"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const esgAssessmentsRelations = relations(esgAssessments, ({ many }) => ({
    answers: many(esgAnswers),
}));

export const esgTopicsRelations = relations(esgTopics, ({ many }) => ({
    disclosures: many(esgDisclosures),
}));

export const esgDisclosuresRelations = relations(esgDisclosures, ({ one, many }) => ({
    topic: one(esgTopics, {
        fields: [esgDisclosures.topicId],
        references: [esgTopics.id],
    }),
    questions: many(esgQuestions),
}));

export const esgQuestionsRelations = relations(esgQuestions, ({ one, many }) => ({
    disclosure: one(esgDisclosures, {
        fields: [esgQuestions.disclosureId],
        references: [esgDisclosures.id],
    }),
    answers: many(esgAnswers),
}));

export const esgAnswersRelations = relations(esgAnswers, ({ one }) => ({
    assessment: one(esgAssessments, {
        fields: [esgAnswers.assessmentId],
        references: [esgAssessments.id],
    }),
    question: one(esgQuestions, {
        fields: [esgAnswers.questionId],
        references: [esgQuestions.id],
    }),
}));

export const domesticWasteLogsRelations = relations(domesticWasteLogs, ({ one }) => ({
    destination: one(wastePartners, {
        fields: [domesticWasteLogs.destinationId],
        references: [wastePartners.id],
    }),
    source: one(wasteSources, {
        fields: [domesticWasteLogs.sourceId],
        references: [wasteSources.id],
    }),
}));

export const wastePartnersRelations = relations(wastePartners, ({ many }) => ({
    logs: many(domesticWasteLogs),
}));

export const wasteSourcesRelations = relations(wasteSources, ({ many }) => ({
    logs: many(domesticWasteLogs),
}));
// --- LEGAL REGISTER ---
export const legalRegisters = pgTable("legal_registers", {
    id: text("id").primaryKey(),
    no: doublePrecision("no"),
    externalDocumentRegister: text("external_document_register"),
    regulator: text("regulator"),
    subjectMatter: text("subject_matter"),
    title: text("title"),
    clause: text("clause"),
    descriptionOfClause: text("description_of_clause"),
    descriptionOfCompliance: text("description_of_compliance"),
    category: text("category"),
    comply: text("comply"), // Y/N or Obligation
    percentage: text("percentage"), // e.g. "TBD" or "100%"
    evidence: text("evidence"),
    programOfCompliance: text("program_of_compliance"),
    lastUpdated: timestamp("last_updated"),
    lastReviewed: timestamp("last_reviewed"),
    nextReviewDate: timestamp("next_review_date"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});
