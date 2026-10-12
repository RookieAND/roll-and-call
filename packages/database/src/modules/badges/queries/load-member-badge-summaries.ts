import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { rulebookCategories, serverMembers, userBadges } from "#/schema";

// 명단·순위처럼 여러 사람의 대표 칭호를 한 번에 보여 줄 때 쓴다. 한 사람 몫의 뱃지 기록은 loadUserBadges와 같은 모양이다.
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
        categoryName: sql<
          string | null
        >`coalesce(${rulebookCategories.alias}, ${rulebookCategories.name})`,
      })
      .from(userBadges)
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
      .map(({ badgeKey, tier, categoryName }) => ({ badgeKey, tier, categoryName })),
  }));
}

export type MemberBadgeSummary = Awaited<ReturnType<typeof loadMemberBadgeSummaries>>[number];
