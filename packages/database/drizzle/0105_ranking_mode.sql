ALTER TABLE "servers" ADD COLUMN "ranking_mode" text DEFAULT 'count' NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD CONSTRAINT "servers_ranking_mode" CHECK ("servers"."ranking_mode" in ('count', 'points'));--> statement-breakpoint
UPDATE "servers" SET "ranking_mode" = 'points' WHERE "slug" = 'canvas';
