ALTER TABLE "personal_projects" ADD COLUMN "type" text DEFAULT 'production' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_projects" ADD COLUMN "type" text DEFAULT 'production' NOT NULL;