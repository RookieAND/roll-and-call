ALTER TABLE "games" ADD COLUMN "drawn_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "participants" ADD COLUMN "draw_rank" integer;