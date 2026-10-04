-- pg_cron이 Next 라우트를 부를 때 Vault의 app_url·cron_secret을 쓴다. 값 넣는 법은 README의 크론 절.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
