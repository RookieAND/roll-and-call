-- 출석 자동 확정 크론이 다회차의 회차도 집도록 게이트를 넓힌다. 단발은 구인 단위(기존 조건), 다회차는 회차 단위다.
SELECT cron.unschedule('attendance-auto-confirm');--> statement-breakpoint
SELECT cron.schedule(
  'attendance-auto-confirm',
  '5 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/attendance',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games g
    WHERE g.round_count = 1 AND g.confirmed_at IS NOT NULL AND g.attendance_confirmed_at IS NULL AND g.attendance_first_confirmed_at IS NULL AND g.cancelled_at IS NULL
      AND coalesce(g.ended_at, g.confirmed_at + coalesce(g.play_minutes, 180) * interval '1 minute') + interval '24 hours' <= now()
      AND EXISTS (SELECT 1 FROM participants p WHERE p.game_id = g.id AND p.status = 'confirmed')
  ) OR EXISTS (
    SELECT 1 FROM game_rounds r JOIN games g ON g.id = r.game_id
    WHERE g.round_count > 1 AND g.cancelled_at IS NULL
      AND r.start_at IS NOT NULL AND r.attendance_confirmed_at IS NULL
      AND coalesce(r.ended_at, r.planned_end_at) + interval '24 hours' <= now()
  )$$
);--> statement-breakpoint
-- 조율형 다회차의 30일 자동 종결. 하루 한 번(06:10 KST), 끝나지 않은 조율형 다회차가 있을 때만 부른다.
SELECT cron.schedule(
  'finish-stale-rounds',
  '10 21 * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/rounds',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games g
    WHERE g.round_schedule_kind = 'coordinated' AND g.round_count > 1
      AND g.finished_at IS NULL AND g.cancelled_at IS NULL
  )$$
);
