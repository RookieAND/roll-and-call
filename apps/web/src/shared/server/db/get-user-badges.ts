import "server-only";
import { db, games, rulebookCategories, userBadges } from "@roll-and-call/database";
import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { cache } from "react";

// 회수되지 않은 뱃지. 이달의 GM·PL은 지난 달 것도 기록으로 함께 온다(지금 붙어 있는지는 entities/badge가 가린다).
// 룰별 뱃지 이름은 표시할 때 분류 이름을 붙이므로 분류 이름을 같이 읽는다. 숨긴 구인은 근거 세션 링크를 내지 않는다.
export const getUserBadges = cache(async (userId: string) => {
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
    .leftJoin(games, eq(games.id, userBadges.sourceGameId))
    .leftJoin(
      rulebookCategories,
      sql`${rulebookCategories.id}::text = split_part(${userBadges.badgeKey}, '.', 3)`,
    )
    .where(and(eq(userBadges.userId, userId), isNull(userBadges.revokedAt)))
    .orderBy(desc(userBadges.earnedAt));
  return rows.map(({ sourceGameId, sourceTitle, sourceStartsAt, sourceHiddenAt, ...row }) => ({
    ...row,
    source:
      sourceGameId && sourceTitle && sourceStartsAt && !sourceHiddenAt
        ? { gameId: sourceGameId, title: sourceTitle, startsAt: sourceStartsAt }
        : null,
  }));
});

export type BadgeRecord = Awaited<ReturnType<typeof getUserBadges>>[number];
