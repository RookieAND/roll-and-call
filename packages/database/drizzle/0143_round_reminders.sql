ALTER TABLE "game_rounds" ADD COLUMN "notified_at" timestamp with time zone;--> statement-breakpoint
-- session-reminders: 0141 조건에 다회차 회차의 1시간 전 알림(공개 구인 스레드)을 더한다.
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
    WHERE g.round_count = 1 AND g.confirmed_at IS NOT NULL AND g.discord_thread_id IS NOT NULL AND g.visibility = 'public'
      AND g.hidden_at IS NULL AND g.cancelled_at IS NULL
      AND (
        (g.notified_at IS NULL AND g.confirmed_at > now() AND g.confirmed_at <= now() + interval '1 hour'
          AND EXISTS (SELECT 1 FROM participants p WHERE p.game_id = g.id AND p.status = 'confirmed'))
        OR (g.start_notified_at IS NULL AND g.confirmed_at <= now() AND g.confirmed_at > now() - interval '30 minutes')
      )
  ) OR EXISTS (
    SELECT 1 FROM game_rounds r JOIN games g ON g.id = r.game_id
    WHERE g.round_count > 1 AND g.discord_thread_id IS NOT NULL AND g.visibility = 'public'
      AND g.hidden_at IS NULL AND g.cancelled_at IS NULL
      AND (
        (r.notified_at IS NULL AND r.start_at > now() AND r.start_at <= now() + interval '1 hour'
          AND EXISTS (SELECT 1 FROM participants p WHERE p.game_id = g.id AND p.status = 'confirmed'))
        OR (r.start_notified_at IS NULL AND r.start_at <= now() AND r.start_at > now() - interval '30 minutes')
      )
  )$$
);--> statement-breakpoint
-- session-ended-tasks: 0123 조건에 비공개 다회차 회차의 1시간 전·시작 웹 알림을 더한다.
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
    WHERE visibility = 'private' AND round_count = 1 AND cancelled_at IS NULL AND hidden_at IS NULL
      AND confirmed_at IS NOT NULL
      AND (
        (notified_at IS NULL AND confirmed_at > now() AND confirmed_at <= now() + interval '1 hour')
        OR (start_notified_at IS NULL AND confirmed_at <= now() AND confirmed_at > now() - interval '30 minutes')
      )
  ) OR EXISTS (
    SELECT 1 FROM game_rounds r JOIN games g ON g.id = r.game_id
    WHERE g.visibility = 'private' AND g.round_count > 1 AND g.cancelled_at IS NULL AND g.hidden_at IS NULL
      AND (
        (r.notified_at IS NULL AND r.start_at > now() AND r.start_at <= now() + interval '1 hour')
        OR (r.start_notified_at IS NULL AND r.start_at <= now() AND r.start_at > now() - interval '30 minutes')
      )
  )$$
);
