ALTER TABLE "games" ADD COLUMN "thread_locked_at" timestamp with time zone;--> statement-breakpoint
-- 다회차 크론을 매시 15분으로 바꾸고, 끝났는데 스레드를 아직 잠그지 않은 다회차가 있을 때도 부른다.
SELECT cron.unschedule('finish-stale-rounds');--> statement-breakpoint
SELECT cron.schedule(
  'finish-stale-rounds',
  '15 * * * *',
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
  ) OR EXISTS (
    SELECT 1 FROM games g
    WHERE g.round_count > 1 AND g.finished_at IS NOT NULL AND g.finished_at <= now()
      AND g.discord_thread_id IS NOT NULL AND g.thread_locked_at IS NULL
  )$$
);
