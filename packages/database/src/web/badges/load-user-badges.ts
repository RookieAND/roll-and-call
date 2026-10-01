import { and, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "../../client";
import { games, rulebookCategories, userBadges } from "../../schema";

// 회수되지 않은 뱃지. 이달의 GM·PL은 지난 달 것도 기록으로 함께 온다(지금 붙어 있는지는 entities/badge가 가린다).
// 룰별 뱃지 이름은 표시할 때 분류 이름을 붙이므로 분류 이름을 같이 읽는다. 숨긴 구인은 근거 세션 링크를 내지 않는다.
export async function loadUserBadges({ serverId, userId }: { serverId: string; userId: string }) {
  const rows = await db
    .select({
      badgeKey: userBadges.badgeKey,
      tier: userBadges.tier,
      earnedAt: userBadges.earnedAt,
      notifiedAt: userBadges.notifiedAt,
      seenAt: userBadges.seenAt,
      categoryName: rulebookCategories.name,
      sourceGameId: userBadges.sourceGameId,
      sourceTitle: games.title,
      sourceStartsAt: games.confirmedAt,
      sourceHiddenAt: games.hiddenAt,
    })
    .from(userBadges)
    .leftJoin(games, and(eq(games.serverId, serverId), eq(games.id, userBadges.sourceGameId)))
    .leftJoin(
      rulebookCategories,
      sql`${rulebookCategories.id}::text = split_part(${userBadges.badgeKey}, '.', 3)`,
    )
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        isNull(userBadges.revokedAt),
      ),
    )
    .orderBy(desc(userBadges.earnedAt));
  return rows.map(({ sourceGameId, sourceTitle, sourceStartsAt, sourceHiddenAt, ...row }) => ({
    ...row,
    source:
      sourceGameId && sourceTitle && sourceStartsAt && !sourceHiddenAt
        ? { gameId: sourceGameId, title: sourceTitle, startsAt: sourceStartsAt }
        : null,
  }));
}

export type BadgeRecord = Awaited<ReturnType<typeof loadUserBadges>>[number];
