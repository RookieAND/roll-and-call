-- 마감 때 추첨: 10분마다, 추첨할 글이 있을 때만 Next 라우트 /api/cron/draws를 부른다(Vault app_url·cron_secret, README의 크론 절).
-- 마감 뒤 10분 안에 추첨한다(기본안 5분에서 사용자가 늘림). 실패한 회차는 다음 10분에 다시 집는다. 추첨할 글이 없으면 함수를 부르지 않는다(listDueLotteries와 같은 조건). 간격을 줄이려면 이 일정만 바꾼다.
-- 라우트가 배포되고 Vault 값이 들어간 뒤에 적용한다.
CREATE INDEX "games_lottery_due_idx" ON "games" USING btree ("end_date") WHERE recruit_method = 'lottery' and drawn_at is null and cancelled_at is null;--> statement-breakpoint
SELECT cron.schedule(
  'draw-lotteries',
  '*/10 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/draws',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  ) WHERE EXISTS (
    SELECT 1 FROM games
    WHERE recruit_method = 'lottery' AND drawn_at IS NULL AND cancelled_at IS NULL AND end_date <= now()
      AND (confirmed_at IS NULL OR (schedule_mode = 'fixed' AND confirmed_at > now()))
  )$$
);
