ALTER TABLE "games" DROP CONSTRAINT "games_parent_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "parent_game_id";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "round";