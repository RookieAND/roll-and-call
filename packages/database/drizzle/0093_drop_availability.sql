DROP TABLE "availabilities" CASCADE;--> statement-breakpoint
ALTER TABLE "server_members" DROP COLUMN "availability";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "availability";--> statement-breakpoint
ALTER TABLE "participants" DROP COLUMN "availability_submitted_at";