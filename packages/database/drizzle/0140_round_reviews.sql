DROP INDEX "session_reviews_game_id_author_id_unique";--> statement-breakpoint
CREATE INDEX "session_reviews_game_id_author_id_idx" ON "session_reviews" USING btree ("game_id","author_id");