CREATE TYPE "public"."participant_status" AS ENUM('confirmed', 'waiting');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "parent_game_id" uuid;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "round" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "status" "participant_status" DEFAULT 'confirmed' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_parent_game_id_games_id_fk" FOREIGN KEY ("parent_game_id") REFERENCES "public"."games"("id") ON DELETE set null ON UPDATE no action;