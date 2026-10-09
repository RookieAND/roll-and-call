ALTER TYPE "public"."game_cancel_kind" ADD VALUE 'selection_expired';--> statement-breakpoint
ALTER TYPE "public"."recruit_method" ADD VALUE 'selection';--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "selection_finished_at" timestamp with time zone;