-- 세션 종료 안내를 없애며 안내 시각 칸과 인덱스를 지운다. 크론 notify-session-ended는 0119에서 session-ended-tasks로 바뀌었다.
DROP INDEX IF EXISTS "games_end_notice_due_idx";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "end_notified_at";
