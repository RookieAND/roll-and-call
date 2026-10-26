-- 후기 작성 알림(웹): 종료 판정 시각이 지나면 한 번 보낸다. 출석 확정으로 이미 알림이 나간 구인은 다시 보내지 않게 지금 시각으로 채운다.
ALTER TABLE "games" ADD COLUMN "review_notified_at" timestamp with time zone;--> statement-breakpoint
UPDATE "games" SET "review_notified_at" = now() WHERE "attendance_first_confirmed_at" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "games_review_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and review_notified_at is null and cancelled_at is null;--> statement-breakpoint
-- 5분마다, 종료 판정이 지났는데 후기 알림을 보내지 않은 구인이 있을 때만 /api/cron/session-ended를 부른다(notify-session-ended를 대체, 라우트가 배포된 뒤에 적용한다).
SELECT cron.unschedule('notify-session-ended');--> statement-breakpoint
SELECT cron.schedule(
  'session-ended-tasks',
  '*/5 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/session-ended',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games
    WHERE confirmed_at IS NOT NULL AND review_notified_at IS NULL AND cancelled_at IS NULL AND hidden_at IS NULL
      AND coalesce(ended_at, confirmed_at + coalesce(play_minutes, 180) * interval '1 minute') <= now()
  )$$
);
