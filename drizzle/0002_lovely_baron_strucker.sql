ALTER TABLE "project" RENAME TO "personal_projects";--> statement-breakpoint
ALTER TABLE "personal_projects" DROP CONSTRAINT "project_slug_unique";--> statement-breakpoint
ALTER TABLE "personal_projects" DROP CONSTRAINT "project_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_projects" ADD CONSTRAINT "personal_projects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_projects" ADD CONSTRAINT "personal_projects_slug_unique" UNIQUE("slug");