ALTER TABLE "games" ADD COLUMN "attendance_confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "absent" boolean DEFAULT false NOT NULL;