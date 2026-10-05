-- 코드 배포 전에 적용한다. 사유를 코드(목록의 키)와 기타 입력 글로 나눠 담을 칸을 더한다. 옛 칸 삭제는 0077(코드 배포 뒤)이다.
ALTER TABLE "sanctions" ALTER COLUMN "reason" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "ban_reason_code" text;--> statement-breakpoint
ALTER TABLE "server_members" ADD COLUMN "ban_reason_text" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "hidden_reason_code" text;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "hidden_reason_text" text;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "hidden_reason_code" text;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "hidden_reason_text" text;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "removed_reason_code" text;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD COLUMN "removed_reason_text" text;--> statement-breakpoint
ALTER TABLE "sanctions" ADD COLUMN "reason_code" text;--> statement-breakpoint
ALTER TABLE "sanctions" ADD COLUMN "reason_text" text;--> statement-breakpoint
-- 손으로 쓴 SQL: 옛 사유 글을 {코드, 글}로 나눈다. 목록 이름(또는 옛 후기 행의 키)과 같으면 그 코드,
-- 「기타 · …」면 other + 뒤 글, 그 밖(제재·추방의 기타 입력 등)은 other + 원문이다. 0077이 한 번 더 쓰고 지운다.
CREATE OR REPLACE FUNCTION "split_moderation_reason"("reason" text, "labels" jsonb) RETURNS text[]
LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN "reason" IS NULL THEN ARRAY[NULL, NULL]::text[]
    WHEN "labels" ? "reason" THEN ARRAY["reason", NULL]::text[]
    WHEN EXISTS (SELECT 1 FROM jsonb_each_text("labels") AS l WHERE l.value = "reason")
      THEN ARRAY[(SELECT l.key FROM jsonb_each_text("labels") AS l WHERE l.value = "reason" LIMIT 1), NULL]::text[]
    WHEN "reason" LIKE '기타 · %' THEN ARRAY['other', substr("reason", char_length('기타 · ') + 1)]::text[]
    ELSE ARRAY['other', "reason"]::text[]
  END
$$;--> statement-breakpoint
-- 손으로 쓴 SQL: 구인·후기는 CONTENT_REASON, 제재·추방은 USER_ACTION_REASON 목록(기타 제외)으로 백필한다.
UPDATE "games" SET ("hidden_reason_code", "hidden_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("hidden_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "hidden_reason" IS NOT NULL AND "hidden_reason_code" IS NULL;--> statement-breakpoint
UPDATE "session_reviews" SET ("hidden_reason_code", "hidden_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("hidden_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "hidden_reason" IS NOT NULL AND "hidden_reason_code" IS NULL;--> statement-breakpoint
UPDATE "session_reviews" SET ("removed_reason_code", "removed_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("removed_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "removed_reason" IS NOT NULL AND "removed_reason_code" IS NULL;--> statement-breakpoint
UPDATE "sanctions" SET ("reason_code", "reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("reason", '{"no_show":"반복된 불참","abuse":"욕설·비방","privacy":"개인정보 노출","impersonation":"부적절한 닉네임·사칭","spoiler":"스포일러 미표시"}') AS r
) WHERE "reason" IS NOT NULL AND "reason_code" IS NULL;--> statement-breakpoint
UPDATE "server_members" SET ("ban_reason_code", "ban_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("ban_reason", '{"no_show":"반복된 불참","abuse":"욕설·비방","privacy":"개인정보 노출","impersonation":"부적절한 닉네임·사칭","spoiler":"스포일러 미표시"}') AS r
) WHERE "ban_reason" IS NOT NULL AND "ban_reason_code" IS NULL;
