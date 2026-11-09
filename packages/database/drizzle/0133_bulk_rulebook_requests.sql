ALTER TABLE "rulebook_requests" ADD COLUMN "group_id" uuid;--> statement-breakpoint
CREATE INDEX "rulebook_requests_server_group_idx" ON "rulebook_requests" USING btree ("server_id","group_id");