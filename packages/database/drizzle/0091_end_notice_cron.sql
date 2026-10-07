-- 세션 종료 안내: 5분마다, 끝났는데 안내하지 않은 구인이 있을 때만 Next 라우트 /api/cron/session-ended를 부른다(Vault app_url·cron_secret, README의 크론 절).
-- 조건은 listDueEndNotices와 같다. 라우트가 배포된 뒤에 적용한다.
SELECT cron.schedule(
  'notify-session-ended',
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
    WHERE confirmed_at IS NOT NULL AND discord_thread_id IS NOT NULL AND end_notified_at IS NULL
      AND cancelled_at IS NULL AND hidden_at IS NULL
      AND coalesce(ended_at, confirmed_at + coalesce(play_minutes, 180) * interval '1 minute') <= now()
  )$$
);
