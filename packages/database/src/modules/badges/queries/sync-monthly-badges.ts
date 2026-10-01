import { and, eq, like, or } from "drizzle-orm";
import { groupBy, uniq } from "es-toolkit";

import { db } from "../../../client";
import { userBadges } from "../../../schema";
import { applyBadgeWrites } from "../commands/apply-badge-writes";
import { BADGE_LADDER } from "../model/badge-ladder";
import { diffBadges } from "../model/diff-badges";
import { isMonthSettled } from "../model/is-month-settled";
import { monthlyWinners } from "../model/monthly-winners";
import { parseBadgeKey } from "../model/parse-badge-key";
import { loadMonthlyAppearances } from "./load-monthly-appearances";

// 이달의 GM·PL은 여러 사람을 견주므로 한 사람만 다시 계산할 수 없다. 전체 1위를 다시 정해 모두와 비교한다.
// 이미 준 달이 굳었으면(isMonthSettled) 그 달은 건드리지 않는다. 한 번도 주지 않은 달은 굳었어도 새로 준다.
export async function syncMonthlyBadges({ serverId, now }: { serverId: string; now: Date }) {
  const [appearances, stored] = await Promise.all([
    loadMonthlyAppearances({ serverId, now }),
    db
      .select({
        userId: userBadges.userId,
        badgeKey: userBadges.badgeKey,
        tier: userBadges.tier,
        revokedAt: userBadges.revokedAt,
      })
      .from(userBadges)
      .where(
        and(
          eq(userBadges.serverId, serverId),
          or(
            like(userBadges.badgeKey, `${BADGE_LADDER.gmMonthly}.%`),
            like(userBadges.badgeKey, `${BADGE_LADDER.playerMonthly}.%`),
          ),
        ),
      ),
  ]);
  const awardedKeys = new Set(stored.map((badge) => badge.badgeKey));
  const isFrozen = (key: string) =>
    awardedKeys.has(key) && isMonthSettled(parseBadgeKey(key)!.subject!, now);
  const winners = monthlyWinners(appearances, now).filter((winner) => !isFrozen(winner.badgeKey));
  const open = stored.filter((badge) => !isFrozen(badge.badgeKey));
  const desiredByUser = groupBy(winners, (winner) => winner.userId);
  const storedByUser = groupBy(open, (badge) => badge.userId);
  const userIds = uniq([...Object.keys(desiredByUser), ...Object.keys(storedByUser)]);

  for (const userId of userIds) {
    const writes = diffBadges({
      stored: storedByUser[userId] ?? [],
      desired: desiredByUser[userId] ?? [],
    });
    await applyBadgeWrites({ serverId, userId, writes, now });
  }
}
