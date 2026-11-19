CREATE TYPE "public"."game_incomplete_reason" AS ENUM('manual', 'stale');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "incomplete_reason" "game_incomplete_reason";--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_incomplete_reason_shape" CHECK (("games"."incomplete_at" is null) = ("games"."incomplete_reason" is null));--> statement-breakpoint
-- 기존 알림은 만든 시각부터 보였던 것으로 채운다.
ALTER TABLE "notifications" ADD COLUMN "visible_at" timestamp with time zone;--> statement-breakpoint
UPDATE "notifications" SET "visible_at" = "created_at";--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "visible_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "visible_at" SET NOT NULL;
