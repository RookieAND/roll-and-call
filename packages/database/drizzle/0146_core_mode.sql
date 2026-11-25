ALTER TABLE "rulebook_categories" ADD COLUMN "core_mode" text DEFAULT 'all' NOT NULL;--> statement-breakpoint
ALTER TABLE "rulebook_categories" ADD CONSTRAINT "rulebook_categories_core_mode_check" CHECK ("rulebook_categories"."core_mode" in ('all', 'any'));
