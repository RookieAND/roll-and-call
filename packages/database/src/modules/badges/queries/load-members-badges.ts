import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import { rulebookCategories, userBadges } from "#db/schema";

// 유저 목록 카드용으로 여러 명의 뱃지를 한 번에 읽는다. 근거 세션 링크는 카드에 쓰지 않아 읽지 않는다.
export async function loadMembersBadges({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: string[];
}) {
  if (userIds.length === 0) return [];
  return db
    .select({
      userId: userBadges.userId,
      badgeKey: userBadges.badgeKey,
      tier: userBadges.tier,
      earnedAt: userBadges.earnedAt,
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
    .orderBy(desc(userBadges.earnedAt));
}
