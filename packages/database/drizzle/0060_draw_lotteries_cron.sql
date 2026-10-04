-- 마감 때 추첨: 5분마다 Next 라우트 /api/cron/draws를 부른다(Vault app_url·cron_secret, README의 크론 절).
-- 마감 뒤 5분 안에 추첨한다(D119, 개발 계획 기본안). 실패한 회차는 다음 5분에 다시 집는다. 간격을 줄이려면 이 일정만 바꾼다.
-- 라우트가 배포되고 Vault 값이 들어간 뒤에 적용한다.
CREATE INDEX "games_lottery_due_idx" ON "games" USING btree ("end_date") WHERE recruit_method = 'lottery' and drawn_at is null and cancelled_at is null;--> statement-breakpoint
SELECT cron.schedule(
  'draw-lotteries',
  '*/5 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/draws',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret'),
      'Content-Type',
      'application/json'
    ),
    timeout_milliseconds := 60000
  )$$
);
