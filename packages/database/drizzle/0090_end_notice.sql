-- 세션 종료 안내: 안내를 올린 시각. 이미 끝난 세션은 이번에 한꺼번에 안내가 나가지 않게 지금 시각으로 채운다.
ALTER TABLE "games" ADD COLUMN "end_notified_at" timestamp with time zone;--> statement-breakpoint
UPDATE "games" SET "end_notified_at" = now()
WHERE "confirmed_at" IS NOT NULL
  AND coalesce("ended_at", "confirmed_at" + coalesce("play_minutes", 180) * interval '1 minute') <= now();--> statement-breakpoint
CREATE INDEX "games_end_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and end_notified_at is null and cancelled_at is null;
