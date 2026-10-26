CREATE INDEX "games_private_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE visibility = 'private' and cancelled_at is null and (notified_at is null or start_notified_at is null);--> statement-breakpoint
-- session-ended-tasks가 비공개 구인의 1시간 전·시작 웹 알림도 보낸다. 후기 알림 조건에 알림이 남은 비공개 구인을 더한다(라우트가 배포된 뒤에 적용한다).
SELECT cron.unschedule('session-ended-tasks');--> statement-breakpoint
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
  ) OR EXISTS (
    SELECT 1 FROM games
    WHERE visibility = 'private' AND cancelled_at IS NULL AND hidden_at IS NULL
      AND confirmed_at IS NOT NULL
      AND (
        (notified_at IS NULL AND confirmed_at > now() AND confirmed_at <= now() + interval '1 hour')
        OR (start_notified_at IS NULL AND confirmed_at <= now() AND confirmed_at > now() - interval '30 minutes')
      )
  )$$
);
