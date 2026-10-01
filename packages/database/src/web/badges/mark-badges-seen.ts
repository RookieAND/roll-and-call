import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../client";
import { userBadges } from "../../schema";

export async function markBadgesSeen({ serverId, userId }: { serverId: string; userId: string }) {
  await db
    .update(userBadges)
    .set({ seenAt: new Date() })
    .where(
      and(
        eq(userBadges.serverId, serverId),
        eq(userBadges.userId, userId),
        isNull(userBadges.seenAt),
      ),
    );
}
