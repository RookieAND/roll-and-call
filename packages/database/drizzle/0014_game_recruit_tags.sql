CREATE TYPE "public"."recruit_method" AS ENUM('first_come', 'lottery');--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "genres" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "triggers" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "platforms" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "notice" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "recruit_method" "recruit_method" DEFAULT 'first_come' NOT NULL;