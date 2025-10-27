ALTER TABLE "personal_projects" ALTER COLUMN "type" SET DEFAULT 'development';--> statement-breakpoint
ALTER TABLE "personal_projects" ALTER COLUMN "envs" SET DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "team_projects" ALTER COLUMN "type" SET DEFAULT 'development';