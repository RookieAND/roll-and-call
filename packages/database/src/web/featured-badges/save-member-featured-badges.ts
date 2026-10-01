import { and, eq } from "drizzle-orm";

import { db } from "../../client";
import { serverMembers } from "../../schema";

export async function saveMemberFeaturedBadges({
  serverId,
  userId,
  featuredBadges,
}: {
  serverId: string;
  userId: string;
  featuredBadges: string[];
}) {
  await db
    .update(serverMembers)
    .set({ featuredBadges })
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
}
