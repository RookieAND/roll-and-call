import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import { games, rulebookCategories, serverMembers, userBadges } from "#db/schema";

// 명단·순위처럼 여러 사람의 대표 칭호를 한 번에 보여 줄 때 쓴다. 한 사람 몫의 뱃지 기록은 loadUserBadges와 같은 모양이다(칭호를 눌러 여는 상세 시트가 받은 날·근거 세션을 쓴다).
export async function loadMemberBadgeSummaries({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: string[];
}) {
  if (userIds.length === 0) return [];
  const [members, records] = await Promise.all([
    db
      .select({
        userId: serverMembers.userId,
        showBadges: serverMembers.showBadges,
        featuredBadges: serverMembers.featuredBadges,
      })
      .from(serverMembers)
      .where(and(eq(serverMembers.serverId, serverId), inArray(serverMembers.userId, userIds))),
    db
      .select({
        userId: userBadges.userId,
        badgeKey: userBadges.badgeKey,
        tier: userBadges.tier,
        earnedAt: userBadges.earnedAt,
        notifiedAt: userBadges.notifiedAt,
        categoryName: sql<
          string | null
        >`coalesce(${rulebookCategories.alias}, ${rulebookCategories.name})`,
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
          inArray(userBadges.userId, userIds),
          isNull(userBadges.revokedAt),
        ),
      )
      .orderBy(desc(userBadges.earnedAt)),
  ]);

  return members.map((member) => ({
    ...member,
    records: records
      .filter((record) => record.userId === member.userId)
      .map(
        ({
          userId: _userId,
          sourceGameId,
          sourceTitle,
          sourceStartsAt,
          sourceHiddenAt,
          ...record
        }) => ({
          ...record,
          source:
            sourceGameId && sourceTitle && sourceStartsAt && !sourceHiddenAt
              ? { gameId: sourceGameId, title: sourceTitle, startsAt: sourceStartsAt }
              : null,
        }),
      ),
  }));
}

export type MemberBadgeSummary = Awaited<ReturnType<typeof loadMemberBadgeSummaries>>[number];
