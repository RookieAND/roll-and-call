ALTER TABLE "user_badges" ADD COLUMN "notified_tier" integer;--> statement-breakpoint
-- 손으로 쓴 SQL: 배포 전에 받은 업적은 이미 알린 것으로 본다. 이달의 뱃지는 빼서, 8일 전에 미리 줬다 회수되는 지난달 뱃지가 8일 지급 때 monthly_award를 받게 한다.
UPDATE "user_badges" SET "notified_tier" = "tier"
WHERE "badge_key" NOT LIKE 'gm.monthly.%' AND "badge_key" NOT LIKE 'pl.monthly.%';
