-- 세션 1시간 전 디스코드 알림: 5분마다 Edge Function session-reminders를 부른다.
-- 함수 주소와 anon 키는 git에 두지 않고 Vault(project_url, anon_key)에서 읽는다.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;--> statement-breakpoint
SELECT cron.schedule(
  'session-reminders',
  '*/5 * * * *',
  $$SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/session-reminders',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    )
  )$$
);
