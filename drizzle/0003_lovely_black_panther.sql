CREATE TABLE "team_projects" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"slug" text NOT NULL,
	"envs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "team_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "personal_projects" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "team_projects" ADD CONSTRAINT "team_projects_team_id_organization_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;