CREATE TABLE "amdal_milestones" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" text DEFAULT 'Pending',
	"progress" integer DEFAULT 0,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "amdal_requirements" (
	"id" text PRIMARY KEY NOT NULL,
	"document_type" text DEFAULT 'AMDAL',
	"parameter" text NOT NULL,
	"type" text DEFAULT 'RPL',
	"frequency" text NOT NULL,
	"last_monitored_date" timestamp,
	"next_due_date" timestamp NOT NULL,
	"status" text DEFAULT 'Pending',
	"pic" text
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"details" text,
	"performed_by" text,
	"timestamp" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "compliance_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"agency" text NOT NULL,
	"category" text DEFAULT 'Other',
	"period_year" integer,
	"period_value" text,
	"priority" text DEFAULT 'Medium',
	"status" text DEFAULT 'Pending',
	"due_date" timestamp NOT NULL,
	"submission_date" timestamp,
	"assigned_to" text,
	"description" text,
	"remarks" text,
	"attachment_url" text,
	"manager_email" text
);
--> statement-breakpoint
CREATE TABLE "domestic_waste_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"category" text NOT NULL,
	"source_id" text,
	"weight" double precision,
	"volume" double precision,
	"unit" text DEFAULT 'kg',
	"vehicle_plate" text,
	"destination_id" text,
	"status" text DEFAULT 'Stored',
	"evidence_url" text,
	"notes" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "esg_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"question_id" text NOT NULL,
	"maturity_score" integer DEFAULT 0 NOT NULL,
	"evidence_url" text,
	"remarks" text,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "esg_assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"title" text,
	"company_name" text,
	"organization_type" text,
	"sector" text DEFAULT 'Oil & Gas',
	"reporting_period" text,
	"contact_point" text,
	"pic_name" text,
	"pic_email" text,
	"overall_score" double precision DEFAULT 0,
	"maturity_level" text,
	"status" text DEFAULT 'Draft',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "esg_disclosures" (
	"id" text PRIMARY KEY NOT NULL,
	"topic_id" text NOT NULL,
	"name" text NOT NULL,
	"reference" text
);
--> statement-breakpoint
CREATE TABLE "esg_questions" (
	"id" text PRIMARY KEY NOT NULL,
	"disclosure_id" text NOT NULL,
	"text" text NOT NULL,
	"type" text DEFAULT 'maturity'
);
--> statement-breakpoint
CREATE TABLE "esg_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"pillar" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ghg_emissions" (
	"id" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"scope" integer NOT NULL,
	"category" text NOT NULL,
	"source" text NOT NULL,
	"value" double precision NOT NULL,
	"unit" text NOT NULL,
	"emission_factor" double precision NOT NULL,
	"co2e" double precision NOT NULL,
	"notes" text,
	"evidence_url" text
);
--> statement-breakpoint
CREATE TABLE "iso_aspects" (
	"id" text PRIMARY KEY NOT NULL,
	"activity" text NOT NULL,
	"aspect" text NOT NULL,
	"impact" text NOT NULL,
	"condition" text DEFAULT 'Normal',
	"severity" integer NOT NULL,
	"probability" integer NOT NULL,
	"significance_score" integer NOT NULL,
	"is_significant" boolean NOT NULL,
	"control_measures" text,
	"status" text DEFAULT 'Active',
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iso_audits" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_type" text NOT NULL,
	"audit_date" timestamp NOT NULL,
	"findings_count" integer DEFAULT 0,
	"status" text DEFAULT 'Scheduled'
);
--> statement-breakpoint
CREATE TABLE "iso_capa" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"description" text NOT NULL,
	"nc_type" text NOT NULL,
	"root_cause" text,
	"corrective_action" text,
	"preventive_action" text,
	"due_date" timestamp NOT NULL,
	"closed_date" timestamp,
	"status" text DEFAULT 'Open',
	"pic" text
);
--> statement-breakpoint
CREATE TABLE "iso_context" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"issue" text NOT NULL,
	"requirement" text,
	"impact" text,
	"strategy" text,
	"status" text DEFAULT 'Active',
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iso_emergency_prep" (
	"id" text PRIMARY KEY NOT NULL,
	"scenario" text NOT NULL,
	"response_plan" text,
	"equipment_required" text,
	"last_drill_date" timestamp,
	"next_drill_date" timestamp,
	"drill_outcome" text,
	"status" text DEFAULT 'Ready',
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_interested_parties" (
	"id" text PRIMARY KEY NOT NULL,
	"party" text NOT NULL,
	"needs" text,
	"expectations" text,
	"is_legal_obligation" boolean DEFAULT false,
	"status" text DEFAULT 'Active',
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_internal_audits" (
	"id" text PRIMARY KEY NOT NULL,
	"audit_title" text NOT NULL,
	"audit_date" timestamp NOT NULL,
	"auditor_name" text,
	"scope" text,
	"findings_summary" text,
	"major_nc" integer DEFAULT 0,
	"minor_nc" integer DEFAULT 0,
	"ofi" integer DEFAULT 0,
	"status" text DEFAULT 'Planned',
	"report_url" text,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_legal_registry" (
	"id" text PRIMARY KEY NOT NULL,
	"id_regulation" text NOT NULL,
	"clause" text,
	"summary" text,
	"relevance" text NOT NULL,
	"compliance_status" text DEFAULT 'Compliant',
	"last_review_date" timestamp,
	"next_review_date" timestamp,
	"evidence_url" text
);
--> statement-breakpoint
CREATE TABLE "iso_management_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"meeting_date" timestamp NOT NULL,
	"chairperson" text,
	"attendees" text,
	"review_inputs" text,
	"decisions_and_actions" text,
	"status" text DEFAULT 'Completed',
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_objectives" (
	"id" text PRIMARY KEY NOT NULL,
	"objective" text NOT NULL,
	"target_value" text NOT NULL,
	"indicator" text NOT NULL,
	"baseline" text,
	"progress" integer DEFAULT 0,
	"deadline" timestamp NOT NULL,
	"department" text,
	"pic" text,
	"status" text DEFAULT 'On Track'
);
--> statement-breakpoint
CREATE TABLE "iso_operational_controls" (
	"id" text PRIMARY KEY NOT NULL,
	"procedure_name" text NOT NULL,
	"description" text,
	"department" text,
	"aspect_link" text,
	"control_method" text,
	"frequency" text,
	"pic" text,
	"document_url" text,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_performance_monitoring" (
	"id" text PRIMARY KEY NOT NULL,
	"indicator_name" text NOT NULL,
	"parameter" text,
	"unit" text,
	"baseline_value" double precision,
	"target_value" double precision,
	"current_value" double precision,
	"frequency" text,
	"status" text DEFAULT 'On Track',
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "iso_risks" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"description" text NOT NULL,
	"potential_impact" text,
	"risk_level" text NOT NULL,
	"mitigation_plan" text,
	"residual_risk" text,
	"status" text DEFAULT 'Open'
);
--> statement-breakpoint
CREATE TABLE "popal_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"certification_number" text NOT NULL,
	"certified_by" text DEFAULT 'BNSP' NOT NULL,
	"validity_start" timestamp NOT NULL,
	"validity_end" timestamp NOT NULL,
	"status" text DEFAULT 'active',
	"company_id" text DEFAULT 'DEFAULT_COMPANY',
	"profile_image_url" text
);
--> statement-breakpoint
CREATE TABLE "proper_assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"status" text DEFAULT 'Draft',
	"predicted_rating" text,
	"final_rating" text,
	"verified_at" timestamp,
	"verified_by" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proper_beyond_compliance" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"energy_efficiency_score" double precision DEFAULT 0,
	"water_conservation_score" double precision DEFAULT 0,
	"biodiversity_score" double precision DEFAULT 0,
	"emission_reduction_score" double precision DEFAULT 0,
	"social_innovation_score" double precision DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "proper_community_dev" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"program_name" text NOT NULL,
	"budget" double precision DEFAULT 0,
	"beneficiaries" integer DEFAULT 0,
	"sroi_score" double precision,
	"innovation_type" text,
	"status" text DEFAULT 'Active',
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "proper_criteria_results" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"category" text NOT NULL,
	"parameter" text NOT NULL,
	"fulfillment" text DEFAULT 'No',
	"score" double precision DEFAULT 0,
	"evidence_url" text,
	"remarks" text,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "proper_inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"assessment_id" text NOT NULL,
	"water_quality_score" double precision DEFAULT 0,
	"air_quality_score" double precision DEFAULT 0,
	"hazardous_waste_score" double precision DEFAULT 0,
	"land_quality_score" double precision DEFAULT 0,
	"compliance_level" text DEFAULT 'None'
);
--> statement-breakpoint
CREATE TABLE "rkab_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"year" integer NOT NULL,
	"production_target" double precision,
	"sales_target" double precision,
	"exploration_cost" double precision,
	"environmental_budget" double precision,
	"technical_doc_link" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "simpel_records" (
	"id" text PRIMARY KEY NOT NULL,
	"report_id" text NOT NULL,
	"proper_rating" text DEFAULT 'BLUE',
	"water_status" text DEFAULT 'Compliant',
	"air_status" text DEFAULT 'Compliant',
	"waste_status" text DEFAULT 'Compliant',
	"last_sync_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" text DEFAULT 'specialist',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waste_manifests" (
	"id" text PRIMARY KEY NOT NULL,
	"manifest_number" text,
	"festronik_id" text,
	"waste_code" text DEFAULT '' NOT NULL,
	"waste_category" text DEFAULT '2' NOT NULL,
	"waste_type" text NOT NULL,
	"weight" double precision NOT NULL,
	"unit" text DEFAULT 'ton',
	"generator_date" timestamp NOT NULL,
	"max_storage_days" integer DEFAULT 90 NOT NULL,
	"transporter_name" text,
	"transporter_license" text,
	"vehicle_plate" text,
	"destination_facility" text,
	"handling_method" text,
	"manager_email" text,
	"status" text DEFAULT 'stored',
	"notes" text,
	"file_url" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waste_partners" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"license_number" text,
	"address" text,
	"contact_person" text,
	"phone" text,
	"vehicle_plate" text,
	"status" text DEFAULT 'Active'
);
--> statement-breakpoint
CREATE TABLE "waste_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" text,
	"status" text DEFAULT 'Active'
);
--> statement-breakpoint
CREATE TABLE "wastewater_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"log_date" timestamp NOT NULL,
	"ph_level" double precision NOT NULL,
	"cod_level" double precision NOT NULL,
	"bod_level" double precision NOT NULL,
	"tss_level" double precision NOT NULL,
	"ammonia_level" double precision NOT NULL,
	"debit_outfall" double precision NOT NULL,
	"popal_id" text,
	"notes" text,
	"is_violation" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "water_quality_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"location_id" text NOT NULL,
	"parameter" text NOT NULL,
	"value" double precision NOT NULL,
	"unit" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"recorded_by" text,
	"is_violation" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "compliance_comments" ADD CONSTRAINT "compliance_comments_report_id_compliance_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."compliance_reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_comments" ADD CONSTRAINT "compliance_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_reports" ADD CONSTRAINT "compliance_reports_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domestic_waste_logs" ADD CONSTRAINT "domestic_waste_logs_source_id_waste_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."waste_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domestic_waste_logs" ADD CONSTRAINT "domestic_waste_logs_destination_id_waste_partners_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."waste_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "esg_answers" ADD CONSTRAINT "esg_answers_assessment_id_esg_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."esg_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "esg_answers" ADD CONSTRAINT "esg_answers_question_id_esg_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."esg_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "esg_disclosures" ADD CONSTRAINT "esg_disclosures_topic_id_esg_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."esg_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "esg_questions" ADD CONSTRAINT "esg_questions_disclosure_id_esg_disclosures_id_fk" FOREIGN KEY ("disclosure_id") REFERENCES "public"."esg_disclosures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proper_assessments" ADD CONSTRAINT "proper_assessments_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proper_beyond_compliance" ADD CONSTRAINT "proper_beyond_compliance_assessment_id_proper_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."proper_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proper_community_dev" ADD CONSTRAINT "proper_community_dev_assessment_id_proper_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."proper_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proper_criteria_results" ADD CONSTRAINT "proper_criteria_results_assessment_id_proper_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."proper_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proper_inventory" ADD CONSTRAINT "proper_inventory_assessment_id_proper_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."proper_assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rkab_submissions" ADD CONSTRAINT "rkab_submissions_report_id_compliance_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."compliance_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simpel_records" ADD CONSTRAINT "simpel_records_report_id_compliance_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."compliance_reports"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wastewater_logs" ADD CONSTRAINT "wastewater_logs_popal_id_popal_profiles_id_fk" FOREIGN KEY ("popal_id") REFERENCES "public"."popal_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "water_quality_logs" ADD CONSTRAINT "water_quality_logs_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "sessions" USING btree ("user_id");