CREATE INDEX "availabilities_user_id_game_id_idx" ON "availabilities" USING btree ("user_id","game_id");--> statement-breakpoint
CREATE INDEX "profile_memos_target_id_idx" ON "profile_memos" USING btree ("target_id");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_max_players_positive" CHECK ("games"."max_players" >= 1);--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_play_minutes_positive" CHECK ("games"."play_minutes" > 0);--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_range_order" CHECK ("games"."range_end" >= "games"."range_start");--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_tag_limits" CHECK (cardinality("games"."genres") <= 5 and cardinality("games"."triggers") <= 5 and cardinality("games"."platforms") <= 5);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_draw_roll_range" CHECK ("participants"."draw_roll" between 1 and 100);--> statement-breakpoint
ALTER TABLE "participants" ADD CONSTRAINT "participants_draw_rank_positive" CHECK ("participants"."draw_rank" >= 1);