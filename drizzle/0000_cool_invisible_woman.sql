CREATE TABLE `amdal_milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'Pending',
	`progress` integer DEFAULT 0,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` text NOT NULL,
	`details` text,
	`performed_by` text,
	`timestamp` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `compliance_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`report_id` text NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`report_id`) REFERENCES `compliance_reports`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `compliance_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`agency` text NOT NULL,
	`category` text DEFAULT 'Other',
	`period_year` integer,
	`period_value` text,
	`priority` text DEFAULT 'Medium',
	`status` text DEFAULT 'Pending',
	`due_date` integer NOT NULL,
	`submission_date` integer,
	`assigned_to` text,
	`description` text,
	`remarks` text,
	`attachment_url` text,
	`manager_email` text,
	FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ghg_emissions` (
	`id` text PRIMARY KEY NOT NULL,
	`period` text NOT NULL,
	`scope` integer NOT NULL,
	`value` real NOT NULL,
	`unit` text DEFAULT 'tCO2e'
);
--> statement-breakpoint
CREATE TABLE `iso_audits` (
	`id` text PRIMARY KEY NOT NULL,
	`audit_type` text NOT NULL,
	`audit_date` integer NOT NULL,
	`findings_count` integer DEFAULT 0,
	`status` text DEFAULT 'Scheduled'
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`image` text,
	`role` text DEFAULT 'specialist',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `waste_manifests` (
	`id` text PRIMARY KEY NOT NULL,
	`manifest_number` text NOT NULL,
	`waste_type` text NOT NULL,
	`weight` real NOT NULL,
	`unit` text DEFAULT 'ton',
	`generator_date` integer NOT NULL,
	`status` text DEFAULT 'stored'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waste_manifests_manifest_number_unique` ON `waste_manifests` (`manifest_number`);--> statement-breakpoint
CREATE TABLE `water_quality_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`location_id` text NOT NULL,
	`parameter` text NOT NULL,
	`value` real NOT NULL,
	`unit` text NOT NULL,
	`timestamp` integer NOT NULL,
	`recorded_by` text,
	`is_violation` integer DEFAULT false,
	FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
