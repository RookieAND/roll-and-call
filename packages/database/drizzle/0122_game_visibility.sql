CREATE TYPE "public"."game_visibility" AS ENUM('public', 'private');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "visibility" "game_visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_private_fixed" CHECK ("games"."visibility" = 'public' or "games"."schedule_mode" = 'fixed');