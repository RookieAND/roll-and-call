import "server-only";
import { db, userBadges } from "@roll-and-call/database";
import { and, eq, isNull } from "drizzle-orm";

export async function markBadgesSeen(userId: string) {
  await db
    .update(userBadges)
    .set({ seenAt: new Date() })
    .where(and(eq(userBadges.userId, userId), isNull(userBadges.seenAt)));
}
