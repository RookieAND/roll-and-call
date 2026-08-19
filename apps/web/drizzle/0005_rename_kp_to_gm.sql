ALTER TABLE "games" RENAME COLUMN "kp_id" TO "gm_id";--> statement-breakpoint
ALTER TABLE "games" RENAME CONSTRAINT "games_kp_id_profiles_id_fk" TO "games_gm_id_profiles_id_fk";
