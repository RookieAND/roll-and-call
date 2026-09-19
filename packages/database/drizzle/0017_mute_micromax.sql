CREATE INDEX "games_gm_id_idx" ON "games" USING btree ("gm_id");--> statement-breakpoint
CREATE INDEX "games_end_date_idx" ON "games" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "games_confirmed_at_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null;--> statement-breakpoint
CREATE INDEX "participants_user_id_idx" ON "participants" USING btree ("user_id");