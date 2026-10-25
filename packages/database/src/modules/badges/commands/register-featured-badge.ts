import { and, eq, sql } from "drizzle-orm";

import type { Executor } from "#db/modules/transaction";
import { serverMembers } from "#db/schema";

// 대표 뱃지가 하나도 지정되지 않은 사람에게만 채운다. 이미 지정한 사람의 선택은 건드리지 않는다.
export async function registerFeaturedBadge({
  executor,
  serverId,
  userId,
  badgeKey,
}: {
  executor: Executor;
  serverId: string;
  userId: string;
  badgeKey: string;
}) {
  await executor
    .update(serverMembers)
    .set({ featuredBadges: [badgeKey] })
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        eq(serverMembers.userId, userId),
        sql`cardinality(${serverMembers.featuredBadges}) = 0`,
      ),
    );
}
