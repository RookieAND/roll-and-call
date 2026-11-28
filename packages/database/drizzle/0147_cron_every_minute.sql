-- 마감 크론을 10분에서 1분 간격으로 줄인다. 마감과 시작이 10분 안이면(예: 19:55 마감·20:00 시작) 추첨·최소 인원 판정·선발 마감이 한 번도 돌지 않고 시작 시각을 넘겨 버렸다.
-- 일정만 바꾸고 명령은 그대로다. 집을 글이 있을 때만 함수를 부르므로 호출 수는 늘지 않는다.
SELECT cron.alter_job((SELECT jobid FROM cron.job WHERE jobname = 'draw-lotteries'), schedule := '* * * * *');--> statement-breakpoint
SELECT cron.alter_job((SELECT jobid FROM cron.job WHERE jobname = 'judge-min-players'), schedule := '* * * * *');--> statement-breakpoint
SELECT cron.alter_job((SELECT jobid FROM cron.job WHERE jobname = 'expire-selection-deadlines'), schedule := '* * * * *');
