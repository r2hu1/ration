ALTER TABLE "teams" DROP CONSTRAINT "teams_members_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_admins_user_id_fk";
--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "teams_guests_user_id_fk";
