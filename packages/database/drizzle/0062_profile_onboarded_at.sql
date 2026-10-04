-- 적용 시점에 있는 계정은 모두 소개를 본 것으로 친다(D302). 구인글로 미리 만든 프로필(아직 로그인한 적 없는 행)도 채워져 그 사람은 첫 로그인 때 소개를 보지 않는다.
ALTER TABLE "profiles" ADD COLUMN "onboarded_at" timestamp with time zone;--> statement-breakpoint
UPDATE "profiles" SET "onboarded_at" = now() WHERE "onboarded_at" IS NULL;
