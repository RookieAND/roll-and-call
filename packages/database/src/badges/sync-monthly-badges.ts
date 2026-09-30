import { like, or } from "drizzle-orm";
import { groupBy } from "es-toolkit";

import { db } from "../client";
import { BADGE_LADDER, diffBadges, monthlyWinners } from "../rules";
import { userBadges } from "../schema";
import { applyBadgeWrites } from "./apply-badge-writes";
import { loadMonthlyAppearances } from "./load-monthly-appearances";

// 이달의 GM·PL은 여러 사람을 견주므로 한 사람만 다시 계산할 수 없다. 전체 1위를 다시 정해 모두와 비교한다.
export async function syncMonthlyBadges(now: Date = new Date()) {
  const [appearances, stored] = await Promise.all([
    loadMonthlyAppearances(now),
    db
      .select({
        userId: userBadges.userId,
        badgeKey: userBadges.badgeKey,
        tier: userBadges.tier,
        revokedAt: userBadges.revokedAt,
      })
      .from(userBadges)
      .where(
        or(
          like(userBadges.badgeKey, `${BADGE_LADDER.gmMonthly}.%`),
          like(userBadges.badgeKey, `${BADGE_LADDER.playerMonthly}.%`),
        ),
      ),
  ]);
  const winners = monthlyWinners(appearances, now);
  const desiredByUser = groupBy(winners, (winner) => winner.userId);
  const storedByUser = groupBy(stored, (badge) => badge.userId);
  const userIds = new Set([...Object.keys(desiredByUser), ...Object.keys(storedByUser)]);

  for (const userId of userIds) {
    const writes = diffBadges(storedByUser[userId] ?? [], desiredByUser[userId] ?? []);
    await applyBadgeWrites(userId, writes, now);
  }
}
