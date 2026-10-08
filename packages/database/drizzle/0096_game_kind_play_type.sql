CREATE TYPE "public"."game_kind" AS ENUM('briefing', 'session');--> statement-breakpoint
CREATE TYPE "public"."play_type" AS ENUM('voice', 'text');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "kind" "game_kind" DEFAULT 'session' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "play_type" "play_type" DEFAULT 'voice' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_briefing_voice" CHECK ("games"."kind" <> 'briefing' or "games"."play_type" = 'voice');