ALTER TABLE "games" ADD COLUMN "play_minutes" integer;--> statement-breakpoint
-- 기존 자유 텍스트를 가장 긴 해석으로 백필한다. 읽히지 않는 값은 null로 두고 손으로 채운다.
UPDATE "games" SET "play_minutes" =
  coalesce((SELECT max(m[1]::int) FROM regexp_matches("play_time", '(\d+)\s*시간', 'g') AS m), 0) * 60
  + coalesce((SELECT max(m[1]::int) FROM regexp_matches("play_time", '(\d+)\s*분', 'g') AS m), 0)
WHERE "play_time" ~ '\d+\s*(시간|분)';
--> statement-breakpoint
-- 원문이 비었거나 "4h"처럼 읽히지 않아 GM에게 직접 물어본 값.
UPDATE "games" SET "play_minutes" = v.minutes FROM (VALUES
  ('1bf1dfc6-afec-4e77-9ef6-9c6dd7c63a90'::uuid, 180),
  ('6135b0a1-5384-4e13-be48-8e497631b0a5'::uuid, 360),
  ('b0d8a895-0a63-430a-9e63-2ebf4e3f18ee'::uuid, 240),
  ('023b9110-3b66-4129-be6f-f6d0007d0cba'::uuid, 240)
) AS v(id, minutes) WHERE "games"."id" = v.id;
