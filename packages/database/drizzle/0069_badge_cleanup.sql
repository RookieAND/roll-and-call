-- 새 뱃지 점을 없앤다(D29·R7).
ALTER TABLE "user_badges" DROP COLUMN "seen_at";--> statement-breakpoint
-- 손으로 쓴 SQL: 후기 사다리(D31·R25)를 없애며 남은 행과 대표 뱃지 키를 지운다. 키 끝에 다른 칸이 붙은 옛 행까지 지운다.
DELETE FROM "user_badges"
WHERE "badge_key" IN ('pl.reviews', 'gm.reviews')
  OR "badge_key" LIKE 'pl.reviews.%'
  OR "badge_key" LIKE 'gm.reviews.%';--> statement-breakpoint
UPDATE "server_members"
SET "featured_badges" = ARRAY(
  SELECT "key" FROM unnest("featured_badges") WITH ORDINALITY AS featured("key", "position")
  WHERE "key" NOT LIKE 'pl.reviews%' AND "key" NOT LIKE 'gm.reviews%'
  ORDER BY "position"
)
WHERE EXISTS (
  SELECT 1 FROM unnest("featured_badges") AS featured("key")
  WHERE "key" LIKE 'pl.reviews%' OR "key" LIKE 'gm.reviews%'
);--> statement-breakpoint
UPDATE "profiles"
SET "featured_badges" = ARRAY(
  SELECT "key" FROM unnest("featured_badges") WITH ORDINALITY AS featured("key", "position")
  WHERE "key" NOT LIKE 'pl.reviews%' AND "key" NOT LIKE 'gm.reviews%'
  ORDER BY "position"
)
WHERE EXISTS (
  SELECT 1 FROM unnest("featured_badges") AS featured("key")
  WHERE "key" LIKE 'pl.reviews%' OR "key" LIKE 'gm.reviews%'
);
