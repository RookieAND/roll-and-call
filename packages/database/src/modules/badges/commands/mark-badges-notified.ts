import { and, eq, inArray } from "drizzle-orm";

import { db } from "../../../client";
import { userBadges } from "../../../schema";

export async function markBadgesNotified({
  serverId,
  userId,
  badgeKeys,
}: {
  serverId: string;
  userId: string;
  badgeKeys: string[];
}) {
  await db
    .update(userBadges)
    .set({ notifiedAt: new Date() })
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        inArray(userBadges.badgeKey, badgeKeys),
      ),
    );
}
