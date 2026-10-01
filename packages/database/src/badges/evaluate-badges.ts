import { eq } from "drizzle-orm";

import { db } from "../client";
import { computeBadges, diffBadges } from "../rules";
import { userBadges } from "../schema";
import { applyBadgeWrites } from "./apply-badge-writes";
import { isRecomputedBadgeKey } from "./is-recomputed-badge-key";
import { loadBadgeFacts } from "./load-badge-facts";
import { syncMonthlyBadges } from "./sync-monthly-badges";

async function evaluateUser(userId: string, now: Date) {
  const [facts, stored] = await Promise.all([
    loadBadgeFacts(userId, now),
    db
      .select({
        badgeKey: userBadges.badgeKey,
        tier: userBadges.tier,
        revokedAt: userBadges.revokedAt,
      })
      .from(userBadges)
      .where(eq(userBadges.userId, userId)),
  ]);
  const writes = diffBadges(
    stored.filter((badge) => isRecomputedBadgeKey(badge.badgeKey)),
    computeBadges(facts),
  );
  await applyBadgeWrites(userId, writes, now);
}

// 지난달 기록이 바뀌었을 수 있어 이달의 뱃지도 다시 맞춘다.
// 실패해도 원래 동작(출석 확인 등)을 되돌리지 않도록 after()에서 부르고, 매일 밤 크론이 전체를 다시 맞춘다.
export async function evaluateBadges(userIds: string[], now: Date = new Date()) {
  for (const userId of new Set(userIds)) await evaluateUser(userId, now);
  await syncMonthlyBadges(now);
}
