-- 출석 자동 확정을 매시 5분에 돌린다(C09 기본안). 확정 시각은 기한 시각으로 남아 실행 지연과 상관없다.
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
  )$$
);
