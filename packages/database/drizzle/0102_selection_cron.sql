DROP INDEX "games_min_players_due_idx";--> statement-breakpoint
CREATE INDEX "games_selection_due_idx" ON "games" USING btree ("end_date") WHERE recruit_method = 'selection' and selection_finished_at is null and cancelled_at is null;--> statement-breakpoint
CREATE INDEX "games_min_players_due_idx" ON "games" USING btree ("end_date") WHERE recruit_method in ('first_come', 'selection') and min_players is not null and min_players_judged_at is null and cancelled_at is null;--> statement-breakpoint
-- 마감 때 최소 인원 판정에 선발 글을 포함한다(같은 이름으로 다시 걸면 일정과 조건이 바뀐다). 선발을 마친 글은 마치기 명령이 판정 표시를 채워 고르지 않는다.
SELECT cron.schedule(
  'judge-min-players',
  '*/10 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/min-players',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games
    WHERE recruit_method IN ('first_come', 'selection') AND min_players IS NOT NULL AND min_players_judged_at IS NULL
      AND selection_finished_at IS NULL AND cancelled_at IS NULL AND end_date <= now()
      AND (confirmed_at IS NULL OR confirmed_at > now())
  )$$
);--> statement-breakpoint
-- 선발 기한 자동 취소: 10분마다, 기한이 지난 선발 글이 있을 때만 Next 라우트 /api/cron/selection-deadline을 부른다(Vault app_url·cron_secret, README의 크론 절).
-- 기한은 마감 + 7일이고 일시 지정형은 세션 시작, 조율형은 조율 기간 종료일의 하루 끝이 더 이르면 그때까지다. 정확한 판정은 라우트의 selectionDeadline이 한다.
-- 라우트가 배포되고 Vault 값이 들어간 뒤에 적용한다.
SELECT cron.schedule(
  'expire-selection-deadlines',
  '*/10 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/selection-deadline',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games
    WHERE recruit_method = 'selection' AND selection_finished_at IS NULL AND cancelled_at IS NULL
      AND end_date <= now()
      AND (
        end_date + interval '7 days' <= now()
        OR (schedule_mode = 'fixed' AND confirmed_at <= now())
        OR (schedule_mode = 'coordinate' AND range_end IS NOT NULL
            AND (range_end::timestamp + interval '1 day') AT TIME ZONE 'Asia/Seoul' <= now())
      )
  )$$
);
