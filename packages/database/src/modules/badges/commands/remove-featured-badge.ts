import { and, eq, sql } from "drizzle-orm";

import type { Executor } from "#db/modules/transaction";
import { serverMembers } from "#db/schema";

// 회수된 칭호를 대표 뱃지 지정에서 뺀다. 「키」와 단계를 못 박은 「키@단계」 모두 뺀다.
export async function removeFeaturedBadge({
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
    .set({
      featuredBadges: sql`array(select entry from unnest(${serverMembers.featuredBadges}) as entry where split_part(entry, '@', 1) <> ${badgeKey})`,
    })
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        eq(serverMembers.userId, userId),
        sql`${badgeKey} = any(array(select split_part(entry, '@', 1) from unnest(${serverMembers.featuredBadges}) as entry))`,
      ),
    );
}
