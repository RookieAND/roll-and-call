-- 이전 시점에 칸이 있던 참여자는 제출한 것으로 친다.
ALTER TABLE "participants" ADD COLUMN "availability_submitted_at" timestamp with time zone;--> statement-breakpoint
UPDATE "participants" p SET "availability_submitted_at" = now() WHERE EXISTS (SELECT 1 FROM "availabilities" a WHERE a."game_id" = p."game_id" AND a."user_id" = p."user_id");
