import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { serverMembers } from "#/schema";

export async function saveMemberShowBadges({
  serverId,
  userId,
  showBadges,
}: {
  serverId: string;
  userId: string;
  showBadges: boolean;
}) {
  await db
    .update(serverMembers)
    .set({ showBadges })
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
}
