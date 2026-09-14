ALTER TABLE "games" ADD COLUMN "discord_thread_id" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "discord_category_id" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "session_ended_at" timestamp with time zone;
