-- 마감 때 최소 인원 판정: 10분마다, 판정할 선착순 글이 있을 때만 Next 라우트 /api/cron/min-players를 부른다(Vault app_url·cron_secret, README의 크론 절).
-- 추첨 글은 추첨 명령(drawLottery)이 판정하므로 여기서 고르지 않는다. 판정할 글이 없으면 함수를 부르지 않는다(listDueMinPlayers와 같은 조건). 간격을 줄이려면 이 일정만 바꾼다.
-- 라우트가 배포되고 Vault 값이 들어간 뒤에 적용한다.
CREATE INDEX "games_min_players_due_idx" ON "games" USING btree ("end_date") WHERE recruit_method = 'first_come' and min_players is not null and min_players_judged_at is null and cancelled_at is null;--> statement-breakpoint
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
    WHERE recruit_method = 'first_come' AND min_players IS NOT NULL AND min_players_judged_at IS NULL
      AND cancelled_at IS NULL AND end_date <= now()
      AND (confirmed_at IS NULL OR confirmed_at > now())
  )$$
);
