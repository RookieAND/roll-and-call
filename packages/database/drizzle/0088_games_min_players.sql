ALTER TABLE "games" ADD COLUMN "min_players" integer;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "min_players_judged_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_min_players_range" CHECK ("games"."min_players" is null or ("games"."min_players" >= 1 and "games"."min_players" <= "games"."max_players"));