ALTER TABLE "games" ADD COLUMN "min_rule_plays" integer;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "require_rulebook_cert" boolean DEFAULT false NOT NULL;