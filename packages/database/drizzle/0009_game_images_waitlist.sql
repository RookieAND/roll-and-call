ALTER TABLE "games" ADD COLUMN "images" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "waitlist_enabled" boolean DEFAULT true NOT NULL;
