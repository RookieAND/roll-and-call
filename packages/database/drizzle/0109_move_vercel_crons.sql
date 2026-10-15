-- Vercel Cron(Hobby는 하루 1회)에서 Supabase pg_cron으로 옮긴다. 라우트는 GET 그대로, 시각도 같은 UTC다(Vault app_url·cron_secret).
-- 두 작업이 길어질 수 있어 타임아웃은 라우트 maxDuration(300초)에 맞춘다. 적용한 뒤에 vercel.json의 crons를 지운다.
SELECT cron.schedule(
  'refresh-badges',
  '5 15 * * *',
  $$SELECT net.http_get(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/badges',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    timeout_milliseconds := 300000
  )$$
);--> statement-breakpoint
SELECT cron.schedule(
  'check-guild-members',
  '10 19 * * *',
  $$SELECT net.http_get(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'app_url') || '/api/cron/members',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'cron_secret')
    ),
    timeout_milliseconds := 300000
  )$$
);
