-- pg_cron 실행 기록(cron.job_run_details)은 매분 도는 작업 때문에 계속 쌓인다. 7일 뒤 지운다.
SELECT cron.schedule(
  'purge-cron-run-details',
  '30 19 * * *',
  $$DELETE FROM cron.job_run_details WHERE end_time < now() - interval '7 days'$$
);
