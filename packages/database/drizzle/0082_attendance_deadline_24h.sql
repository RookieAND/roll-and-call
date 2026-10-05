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
    WHERE g.confirmed_at IS NOT NULL AND g.attendance_confirmed_at IS NULL AND g.attendance_first_confirmed_at IS NULL AND g.cancelled_at IS NULL
      AND coalesce(g.ended_at, g.confirmed_at + coalesce(g.play_minutes, 180) * interval '1 minute') + interval '24 hours' <= now()
      AND EXISTS (SELECT 1 FROM participants p WHERE p.game_id = g.id AND p.status = 'confirmed')
  )$$
);
