-- 운영진 메모 기록을 30일 삭제에서 뺀다(어드민 공통 R12). 목록을 바꾸면 audit-actions.ts의 EXPIRING_AUDIT_ACTIONS도 함께 고친다.
-- 손으로 쓴 SQL(pg_cron): 0027의 같은 이름 작업을 내리고 같은 일정으로 다시 건다.
SELECT cron.unschedule('purge-light-audit-log');--> statement-breakpoint
SELECT cron.schedule(
  'purge-light-audit-log',
  '0 19 * * *',
  $$DELETE FROM public.audit_log
    WHERE created_at < now() - make_interval(days => 30)
      AND action IN ($a$룰북 수정$a$, $a$룰북 연결$a$)$$
);
