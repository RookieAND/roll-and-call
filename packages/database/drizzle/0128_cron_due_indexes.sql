-- 크론이 집는 글을 받쳐 줄 부분 인덱스. 시작·후기 알림 인덱스는 0119·0120에서 이미 만들었지만 schema에 없던 것을 선언만 맞춘다.
CREATE INDEX IF NOT EXISTS "games_reminder_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and notified_at is null and cancelled_at is null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "games_start_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and start_notified_at is null and cancelled_at is null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "games_review_notice_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and review_notified_at is null and cancelled_at is null;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "games_attendance_due_idx" ON "games" USING btree ("confirmed_at") WHERE confirmed_at is not null and attendance_confirmed_at is null and attendance_first_confirmed_at is null and cancelled_at is null;--> statement-breakpoint
-- session-reminders는 보낼 리마인더(1시간 안)나 시작 알림(시작 뒤 30분 안)이 있을 때만 부른다. 이전에는 5분마다 무조건 불렀다.
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
        OR (g.start_notified_at IS NULL AND g.confirmed_at <= now() AND g.confirmed_at > now() - interval '30 minutes')
      )
  )$$
);
