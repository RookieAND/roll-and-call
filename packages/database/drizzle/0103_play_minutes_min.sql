ALTER TABLE "games" ADD COLUMN "play_minutes_min" integer;--> statement-breakpoint
UPDATE "games" SET "play_minutes_min" = "play_minutes" WHERE "play_minutes" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_play_minutes_min_range" CHECK ("games"."play_minutes_min" is null or ("games"."play_minutes_min" > 0 and "games"."play_minutes_min" <= "games"."play_minutes"));
