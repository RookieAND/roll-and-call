ALTER TABLE "homebrew_rule_applications" DROP CONSTRAINT "homebrew_rule_applications_summary_length";--> statement-breakpoint
ALTER TABLE "homebrew_rules" DROP CONSTRAINT "homebrew_rules_summary_length";--> statement-breakpoint
ALTER TABLE "homebrew_rule_applications" ADD CONSTRAINT "homebrew_rule_applications_summary_length" CHECK (char_length("homebrew_rule_applications"."summary") between 1 and 200);--> statement-breakpoint
ALTER TABLE "homebrew_rules" ADD CONSTRAINT "homebrew_rules_summary_length" CHECK (char_length("homebrew_rules"."summary") <= 200);