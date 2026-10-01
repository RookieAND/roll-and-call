import { and, eq } from "drizzle-orm";
import { uniq } from "es-toolkit";

import { db } from "../../../client";
import { userBadges } from "../../../schema";
import { applyBadgeWrites } from "../commands/apply-badge-writes";
import { computeBadges } from "../model/compute-badges";
import { diffBadges } from "../model/diff-badges";
import { isRecomputedBadgeKey } from "../model/is-recomputed-badge-key";
import { loadBadgeFacts } from "./load-badge-facts";
import { syncMonthlyBadges } from "./sync-monthly-badges";

async function evaluateUser({
  serverId,
  userId,
  now,
}: {
  serverId: string;
  userId: string;
  now: Date;
}) {
  const [facts, stored] = await Promise.all([
    loadBadgeFacts({ serverId, userId, now }),
    db
      .select({
        badgeKey: userBadges.badgeKey,
        tier: userBadges.tier,
        revokedAt: userBadges.revokedAt,
      })
      .from(userBadges)
      .where(and(eq(userBadges.serverId, serverId), eq(userBadges.userId, userId))),
  ]);
  const writes = diffBadges({
    stored: stored.filter((badge) => isRecomputedBadgeKey(badge.badgeKey)),
    desired: computeBadges(facts),
  });
  await applyBadgeWrites({ serverId, userId, writes, now });
}

// 지난달 기록이 바뀌었을 수 있어 이달의 뱃지도 다시 맞춘다.
// 실패해도 원래 동작(출석 확인 등)을 되돌리지 않도록 after()에서 부르고, 매일 밤 크론이 전체를 다시 맞춘다.
export async function evaluateBadges({
  serverId,
  userIds,
  now = new Date(),
}: {
  serverId: string;
  userIds: string[];
  now?: Date;
}) {
  for (const userId of uniq(userIds)) await evaluateUser({ serverId, userId, now });
  await syncMonthlyBadges({ serverId, now });
}
