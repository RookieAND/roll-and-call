ALTER TABLE "servers" ADD COLUMN "adult_only_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "adult_only" boolean DEFAULT false NOT NULL;