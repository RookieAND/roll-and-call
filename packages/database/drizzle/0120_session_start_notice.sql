-- 세션 시작 안내: 안내를 올린 시각. 이미 시작한 세션은 이번에 한꺼번에 안내가 나가지 않게 지금 시각으로 채운다(발송 윈도우 30분도 한 번 더 막는다).
ALTER TABLE "games" ADD COLUMN "start_notified_at" timestamp with time zone;--> statement-breakpoint
UPDATE "games" SET "start_notified_at" = now() WHERE "confirmed_at" IS NOT NULL AND "confirmed_at" <= now();--> statement-breakpoint
CREATE INDEX "games_start_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and start_notified_at is null and cancelled_at is null;
