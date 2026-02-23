CREATE TABLE `amdal_requirements` (
	`id` text PRIMARY KEY NOT NULL,
	`document_type` text DEFAULT 'AMDAL',
	`parameter` text NOT NULL,
	`type` text DEFAULT 'RPL',
	`frequency` text NOT NULL,
	`last_monitored_date` integer,
	`next_due_date` integer NOT NULL,
	`status` text DEFAULT 'Pending',
	`pic` text
);
--> statement-breakpoint
CREATE TABLE `domestic_waste_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`category` text NOT NULL,
	`source_id` text,
	`weight` real,
	`volume` real,
	`unit` text DEFAULT 'kg',
	`vehicle_plate` text,
	`destination_id` text,
	`status` text DEFAULT 'Stored',
	`evidence_url` text,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `waste_sources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`destination_id`) REFERENCES `waste_partners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `iso_aspects` (
	`id` text PRIMARY KEY NOT NULL,
	`activity` text NOT NULL,
	`aspect` text NOT NULL,
	`impact` text NOT NULL,
	`condition` text DEFAULT 'Normal',
	`severity` integer NOT NULL,
	`probability` integer NOT NULL,
	`significance_score` integer NOT NULL,
	`is_significant` integer NOT NULL,
	`control_measures` text,
	`status` text DEFAULT 'Active',
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `iso_capa` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`description` text NOT NULL,
	`nc_type` text NOT NULL,
	`root_cause` text,
	`corrective_action` text,
	`preventive_action` text,
	`due_date` integer NOT NULL,
	`closed_date` integer,
	`status` text DEFAULT 'Open',
	`pic` text
);
--> statement-breakpoint
CREATE TABLE `iso_context` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`issue` text NOT NULL,
	`requirement` text,
	`impact` text,
	`strategy` text,
	`status` text DEFAULT 'Active',
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `iso_emergency_prep` (
	`id` text PRIMARY KEY NOT NULL,
	`scenario` text NOT NULL,
	`response_plan` text,
	`equipment_required` text,
	`last_drill_date` integer,
	`next_drill_date` integer,
	`drill_outcome` text,
	`status` text DEFAULT 'Ready',
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_interested_parties` (
	`id` text PRIMARY KEY NOT NULL,
	`party` text NOT NULL,
	`needs` text,
	`expectations` text,
	`is_legal_obligation` integer DEFAULT false,
	`status` text DEFAULT 'Active',
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_internal_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`audit_title` text NOT NULL,
	`audit_date` integer NOT NULL,
	`auditor_name` text,
	`scope` text,
	`findings_summary` text,
	`major_nc` integer DEFAULT 0,
	`minor_nc` integer DEFAULT 0,
	`ofi` integer DEFAULT 0,
	`status` text DEFAULT 'Planned',
	`report_url` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_legal_registry` (
	`id` text PRIMARY KEY NOT NULL,
	`id_regulation` text NOT NULL,
	`clause` text,
	`summary` text,
	`relevance` text NOT NULL,
	`compliance_status` text DEFAULT 'Compliant',
	`last_review_date` integer,
	`next_review_date` integer,
	`evidence_url` text
);
--> statement-breakpoint
CREATE TABLE `iso_management_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`meeting_date` integer NOT NULL,
	`chairperson` text,
	`attendees` text,
	`review_inputs` text,
	`decisions_and_actions` text,
	`status` text DEFAULT 'Completed',
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_objectives` (
	`id` text PRIMARY KEY NOT NULL,
	`objective` text NOT NULL,
	`target_value` text NOT NULL,
	`indicator` text NOT NULL,
	`baseline` text,
	`progress` integer DEFAULT 0,
	`deadline` integer NOT NULL,
	`department` text,
	`pic` text,
	`status` text DEFAULT 'On Track'
);
--> statement-breakpoint
CREATE TABLE `iso_operational_controls` (
	`id` text PRIMARY KEY NOT NULL,
	`procedure_name` text NOT NULL,
	`description` text,
	`department` text,
	`aspect_link` text,
	`control_method` text,
	`frequency` text,
	`pic` text,
	`document_url` text,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_performance_monitoring` (
	`id` text PRIMARY KEY NOT NULL,
	`indicator_name` text NOT NULL,
	`parameter` text,
	`unit` text,
	`baseline_value` real,
	`target_value` real,
	`current_value` real,
	`frequency` text,
	`status` text DEFAULT 'On Track',
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `iso_risks` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`description` text NOT NULL,
	`potential_impact` text,
	`risk_level` text NOT NULL,
	`mitigation_plan` text,
	`residual_risk` text,
	`status` text DEFAULT 'Open'
);
--> statement-breakpoint
CREATE TABLE `popal_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`certification_number` text NOT NULL,
	`certified_by` text DEFAULT 'BNSP' NOT NULL,
	`validity_start` integer NOT NULL,
	`validity_end` integer NOT NULL,
	`status` text DEFAULT 'active',
	`company_id` text DEFAULT 'DEFAULT_COMPANY',
	`profile_image_url` text
);
--> statement-breakpoint
CREATE TABLE `proper_assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`status` text DEFAULT 'Draft',
	`predicted_rating` text,
	`final_rating` text,
	`verified_at` integer,
	`verified_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proper_beyond_compliance` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`energy_efficiency_score` real DEFAULT 0,
	`water_conservation_score` real DEFAULT 0,
	`biodiversity_score` real DEFAULT 0,
	`emission_reduction_score` real DEFAULT 0,
	`social_innovation_score` real DEFAULT 0,
	FOREIGN KEY (`assessment_id`) REFERENCES `proper_assessments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `proper_community_dev` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`program_name` text NOT NULL,
	`budget` real DEFAULT 0,
	`beneficiaries` integer DEFAULT 0,
	`sroi_score` real,
	`innovation_type` text,
	`status` text DEFAULT 'Active',
	`updated_at` integer,
	FOREIGN KEY (`assessment_id`) REFERENCES `proper_assessments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `proper_criteria_results` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`category` text NOT NULL,
	`parameter` text NOT NULL,
	`fulfillment` text DEFAULT 'No',
	`score` real DEFAULT 0,
	`evidence_url` text,
	`remarks` text,
	`updated_at` integer,
	FOREIGN KEY (`assessment_id`) REFERENCES `proper_assessments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `proper_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`assessment_id` text NOT NULL,
	`water_quality_score` real DEFAULT 0,
	`air_quality_score` real DEFAULT 0,
	`hazardous_waste_score` real DEFAULT 0,
	`land_quality_score` real DEFAULT 0,
	`compliance_level` text DEFAULT 'None',
	FOREIGN KEY (`assessment_id`) REFERENCES `proper_assessments`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rkab_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`year` integer NOT NULL,
	`production_target` real,
	`sales_target` real,
	`exploration_cost` real,
	`environmental_budget` real,
	`technical_doc_link` text,
	FOREIGN KEY (`report_id`) REFERENCES `compliance_reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `simpel_records` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`proper_rating` text DEFAULT 'BLUE',
	`water_status` text DEFAULT 'Compliant',
	`air_status` text DEFAULT 'Compliant',
	`waste_status` text DEFAULT 'Compliant',
	`last_sync_date` integer,
	FOREIGN KEY (`report_id`) REFERENCES `compliance_reports`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `waste_partners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`license_number` text,
	`address` text,
	`contact_person` text,
	`phone` text,
	`vehicle_plate` text,
	`status` text DEFAULT 'Active'
);
--> statement-breakpoint
CREATE TABLE `waste_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`location` text,
	`status` text DEFAULT 'Active'
);
--> statement-breakpoint
CREATE TABLE `wastewater_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`log_date` integer NOT NULL,
	`ph_level` real NOT NULL,
	`cod_level` real NOT NULL,
	`bod_level` real NOT NULL,
	`tss_level` real NOT NULL,
	`ammonia_level` real NOT NULL,
	`debit_outfall` real NOT NULL,
	`popal_id` text,
	`notes` text,
	`is_violation` integer DEFAULT false,
	FOREIGN KEY (`popal_id`) REFERENCES `popal_profiles`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_waste_manifests` (
	`id` text PRIMARY KEY NOT NULL,
	`manifest_number` text,
	`festronik_id` text,
	`waste_code` text DEFAULT '' NOT NULL,
	`waste_category` text DEFAULT '2' NOT NULL,
	`waste_type` text NOT NULL,
	`weight` real NOT NULL,
	`unit` text DEFAULT 'ton',
	`generator_date` integer NOT NULL,
	`max_storage_days` integer DEFAULT 90 NOT NULL,
	`transporter_name` text,
	`transporter_license` text,
	`vehicle_plate` text,
	`destination_facility` text,
	`handling_method` text,
	`manager_email` text,
	`status` text DEFAULT 'stored',
	`notes` text,
	`file_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_waste_manifests`("id", "manifest_number", "festronik_id", "waste_code", "waste_category", "waste_type", "weight", "unit", "generator_date", "max_storage_days", "transporter_name", "transporter_license", "vehicle_plate", "destination_facility", "handling_method", "manager_email", "status", "notes", "file_url", "created_at", "updated_at") SELECT "id", "manifest_number", "festronik_id", "waste_code", "waste_category", "waste_type", "weight", "unit", "generator_date", "max_storage_days", "transporter_name", "transporter_license", "vehicle_plate", "destination_facility", "handling_method", "manager_email", "status", "notes", "file_url", "created_at", "updated_at" FROM `waste_manifests`;--> statement-breakpoint
DROP TABLE `waste_manifests`;--> statement-breakpoint
ALTER TABLE `__new_waste_manifests` RENAME TO `waste_manifests`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_ghg_emissions` (
	`id` text PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`scope` integer NOT NULL,
	`category` text NOT NULL,
	`source` text NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`emission_factor` real NOT NULL,
	`co2e` real NOT NULL,
	`notes` text,
	`evidence_url` text
);
--> statement-breakpoint
INSERT INTO `__new_ghg_emissions`("id", "date", "scope", "category", "source", "value", "unit", "emission_factor", "co2e", "notes", "evidence_url") SELECT "id", "date", "scope", "category", "source", "value", "unit", "emission_factor", "co2e", "notes", "evidence_url" FROM `ghg_emissions`;--> statement-breakpoint
DROP TABLE `ghg_emissions`;--> statement-breakpoint
ALTER TABLE `__new_ghg_emissions` RENAME TO `ghg_emissions`;