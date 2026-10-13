import { and, eq, like, or } from "drizzle-orm";
import { groupBy, isNull, uniq } from "es-toolkit";

import { db } from "#/client";
import { applyBadgeWrites } from "#/modules/badges/commands/apply-badge-writes";
import { BADGE_LADDER, HIDDEN_LADDER } from "#/modules/badges/model/badge-ladder";
import { diffBadges } from "#/modules/badges/model/diff-badges";
import { doubleCrownBadges } from "#/modules/badges/model/double-crown-badges";
import { isMonthSettled } from "#/modules/badges/model/is-month-settled";
import { monthlyWinners } from "#/modules/badges/model/monthly-winners";
import { parseBadgeKey } from "#/modules/badges/model/parse-badge-key";
import { RANKING_MODE } from "#/modules/servers/model/ranking-mode";
import { servers, userBadges } from "#/schema";

import { loadMonthlyAppearances } from "./load-monthly-appearances";
import { notifyRankLeaders } from "./notify-rank-leaders";

// 이달의 GM·PL은 여러 사람을 견주므로 한 사람만 다시 계산할 수 없다. 전체 1위를 다시 정해 모두와 비교한다.
// 굳은 달(다음 달 2일 00:00 KST, isMonthSettled)만 준다(R5). 굳기 전에 준 행은 회수하고, 이미 준 굳은 달은 건드리지 않는다.
export async function syncMonthlyBadges({ serverId, now }: { serverId: string; now: Date }) {
  const [appearances, [server], stored] = await Promise.all([
    loadMonthlyAppearances({ serverId, now }),
    db.select({ rankingMode: servers.rankingMode }).from(servers).where(eq(servers.id, serverId)),
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
            eq(userBadges.badgeKey, HIDDEN_LADDER.doubleCrown),
          ),
        ),
      ),
  ]);
  // 알림은 부가 기능이라 실패해도 뱃지 계산을 막지 않는다.
  try {
    await notifyRankLeaders({
      serverId,
      appearances,
      now,
      breakTies: server?.rankingMode === RANKING_MODE.points,
    });
  } catch (error) {
    console.error("notifyRankLeaders failed", error);
  }
  // 굳기 전에 줬다 회수한 사람은 굳은 뒤 다시 정해 준다. 굳은 달에 이미 받은 사람의 행만 건드리지 않는다(공동 1위 중 한 명이 받았다고 나머지를 막지 않는다).
  const isFrozen = (badge: { userId: string; badgeKey: string; revokedAt: Date | null }) =>
    isNull(badge.revokedAt) && isMonthSettled(parseBadgeKey(badge.badgeKey)!.subject!, now);
  const monthlyStored = stored.filter((badge) => badge.badgeKey !== HIDDEN_LADDER.doubleCrown);
  const frozenKeys = new Set(
    monthlyStored.filter(isFrozen).map((badge) => `${badge.userId}|${badge.badgeKey}`),
  );
  // 포인트제는 공동 1위를 두지 않고 먼저 도달한 한 명만 받는다.
  const settledWinners = monthlyWinners(appearances, now, {
    breakTies: server?.rankingMode === RANKING_MODE.points,
  }).filter((winner) => isMonthSettled(parseBadgeKey(winner.badgeKey)!.subject!, now));
  const winners = settledWinners.filter(
    (winner) => !frozenKeys.has(`${winner.userId}|${winner.badgeKey}`),
  );
  // 더블 크라운은 굳은 달의 GM·PL 1위가 한 사람일 때 한 번만 주고, 받은 뒤에는 회수하지 않는다.
  const crownHolders = new Set(
    stored
      .filter((badge) => badge.badgeKey === HIDDEN_LADDER.doubleCrown && isNull(badge.revokedAt))
      .map((badge) => badge.userId),
  );
  const crowns = doubleCrownBadges(settledWinners).filter(
    (crown) => !crownHolders.has(crown.userId),
  );
  const open = monthlyStored.filter((badge) => !isFrozen(badge));
  const desiredByUser = groupBy([...winners, ...crowns], (winner) => winner.userId);
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
