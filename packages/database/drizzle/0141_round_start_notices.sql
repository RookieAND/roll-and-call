ALTER TABLE "game_rounds" ADD COLUMN "start_notified_at" timestamp with time zone;--> statement-breakpoint
-- session-reminders는 단발의 리마인더·시작 안내와 함께 다회차 회차의 시작 안내(시작 뒤 30분 안)가 있을 때도 부른다.
SELECT cron.unschedule('session-reminders');--> statement-breakpoint
SELECT cron.schedule(
  'session-reminders',
  '*/5 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/session-reminders',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    )
  ) WHERE EXISTS (
    SELECT 1 FROM games g
    WHERE g.confirmed_at IS NOT NULL AND g.discord_thread_id IS NOT NULL AND g.visibility = 'public'
      AND g.hidden_at IS NULL AND g.cancelled_at IS NULL
      AND (
        (g.notified_at IS NULL AND g.confirmed_at > now() AND g.confirmed_at <= now() + interval '1 hour'
          AND EXISTS (SELECT 1 FROM participants p WHERE p.game_id = g.id AND p.status = 'confirmed'))
        OR (g.round_count = 1 AND g.start_notified_at IS NULL AND g.confirmed_at <= now() AND g.confirmed_at > now() - interval '30 minutes')
      )
  ) OR EXISTS (
    SELECT 1 FROM game_rounds r JOIN games g ON g.id = r.game_id
    WHERE g.round_count > 1 AND g.discord_thread_id IS NOT NULL AND g.visibility = 'public'
      AND g.hidden_at IS NULL AND g.cancelled_at IS NULL
      AND r.start_notified_at IS NULL AND r.start_at <= now() AND r.start_at > now() - interval '30 minutes'
  )$$
);
