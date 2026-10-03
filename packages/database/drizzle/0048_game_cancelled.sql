CREATE TYPE "public"."game_cancel_kind" AS ENUM('gm', 'staff', 'auto');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "cancelled_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "cancelled_by" uuid;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "cancel_kind" "game_cancel_kind";--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "cancel_reason" text;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_cancelled_by_profiles_id_fk" FOREIGN KEY ("cancelled_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_cancel_reason_length" CHECK (char_length("games"."cancel_reason") <= 200);--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_cancelled_has_kind" CHECK ("games"."cancelled_at" is null or "games"."cancel_kind" is not null);