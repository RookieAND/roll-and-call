import { and, eq, like, or } from "drizzle-orm";
import { groupBy, isNull, uniq } from "es-toolkit";

import { db } from "#/client";
import { applyBadgeWrites } from "#/modules/badges/commands/apply-badge-writes";
import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";
import { diffBadges } from "#/modules/badges/model/diff-badges";
import { isMonthSettled } from "#/modules/badges/model/is-month-settled";
import { monthlyWinners } from "#/modules/badges/model/monthly-winners";
import { parseBadgeKey } from "#/modules/badges/model/parse-badge-key";
import { userBadges } from "#/schema";

import { loadMonthlyAppearances } from "./load-monthly-appearances";

// 이달의 GM·PL은 여러 사람을 견주므로 한 사람만 다시 계산할 수 없다. 전체 1위를 다시 정해 모두와 비교한다.
// 굳은 달(다음 달 8일 00:00 KST, isMonthSettled)만 준다(R5). 굳기 전에 준 행은 회수하고, 이미 준 굳은 달은 건드리지 않는다.
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
  // 굳기 전에 줬다 회수한 달(배포 전 선지급분)은 굳은 뒤 다시 정해 준다.
  const awardedKeys = new Set(
    stored.filter((badge) => isNull(badge.revokedAt)).map((badge) => badge.badgeKey),
  );
  const isFrozen = (key: string) =>
    awardedKeys.has(key) && isMonthSettled(parseBadgeKey(key)!.subject!, now);
  const winners = monthlyWinners(appearances, now).filter(
    (winner) =>
      isMonthSettled(parseBadgeKey(winner.badgeKey)!.subject!, now) && !isFrozen(winner.badgeKey),
  );
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
