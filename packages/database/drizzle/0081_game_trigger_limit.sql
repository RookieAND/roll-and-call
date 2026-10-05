ALTER TABLE "games" DROP CONSTRAINT "games_tag_limits";--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_tag_limits" CHECK (cardinality("games"."genres") <= 5 and cardinality("games"."triggers") <= 10 and cardinality("games"."platforms") <= 5);
