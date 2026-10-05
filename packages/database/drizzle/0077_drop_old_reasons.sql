-- 코드 배포 뒤에 적용한다(옛 코드는 옛 사유 칸에 쓰고 읽는다).
-- 손으로 쓴 SQL: 0075 적용 뒤 코드 배포 전까지 옛 코드가 옛 칸에만 쓴 행을 0075와 같은 규칙으로 한 번 더 나눈다.
UPDATE "games" SET ("hidden_reason_code", "hidden_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("hidden_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "hidden_reason" IS NOT NULL AND "hidden_reason_code" IS NULL AND "hidden_at" IS NOT NULL;--> statement-breakpoint
UPDATE "session_reviews" SET ("hidden_reason_code", "hidden_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("hidden_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "hidden_reason" IS NOT NULL AND "hidden_reason_code" IS NULL AND "hidden_at" IS NOT NULL;--> statement-breakpoint
UPDATE "session_reviews" SET ("removed_reason_code", "removed_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("removed_reason", '{"abuse":"욕설·비방","privacy":"개인정보 노출","spoiler":"스포일러 미표시","image":"부적절한 이미지","unrelated":"세션과 무관한 내용"}') AS r
) WHERE "removed_reason" IS NOT NULL AND "removed_reason_code" IS NULL;--> statement-breakpoint
UPDATE "sanctions" SET ("reason_code", "reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("reason", '{"no_show":"반복된 불참","abuse":"욕설·비방","privacy":"개인정보 노출","impersonation":"부적절한 닉네임·사칭","spoiler":"스포일러 미표시"}') AS r
) WHERE "reason" IS NOT NULL AND "reason_code" IS NULL;--> statement-breakpoint
UPDATE "server_members" SET ("ban_reason_code", "ban_reason_text") = (
  SELECT r[1], r[2] FROM "split_moderation_reason"("ban_reason", '{"no_show":"반복된 불참","abuse":"욕설·비방","privacy":"개인정보 노출","impersonation":"부적절한 닉네임·사칭","spoiler":"스포일러 미표시"}') AS r
) WHERE "ban_reason" IS NOT NULL AND "ban_reason_code" IS NULL AND "banned_at" IS NOT NULL;--> statement-breakpoint
DROP FUNCTION "split_moderation_reason"(text, jsonb);--> statement-breakpoint
ALTER TABLE "sanctions" ALTER COLUMN "reason_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "server_members" DROP COLUMN "ban_reason";--> statement-breakpoint
ALTER TABLE "games" DROP COLUMN "hidden_reason";--> statement-breakpoint
ALTER TABLE "session_reviews" DROP COLUMN "hidden_reason";--> statement-breakpoint
ALTER TABLE "session_reviews" DROP COLUMN "removed_reason";--> statement-breakpoint
ALTER TABLE "sanctions" DROP COLUMN "reason";
