-- 가벼운 활동 기록(안내 DM·운영진 메모·룰북 수정·룰북 연결)만 30일 뒤 지운다.
-- 제재·인증·불참·구인 조치·운영진 변경은 책임 기록이라 계속 남긴다.
-- 목록을 바꾸면 apps/admin의 AUDIT_ACTION_GROUPS 주석도 같이 고친다.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;--> statement-breakpoint
SELECT cron.schedule(
  'purge-light-audit-log',
  '0 19 * * *',
  $$DELETE FROM public.audit_log
    WHERE created_at < now() - interval '30 days'
      AND action IN ('안내 DM', '운영진 메모', '룰북 수정', '룰북 연결')$$
);
