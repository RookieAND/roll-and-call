import "server-only";
import { db, userBadges } from "@roll-and-call/database";
import { and, eq, isNull } from "drizzle-orm";

// 도감을 열면 새 뱃지 점을 끈다.
export async function markBadgesSeen(userId: string) {
  await db
    .update(userBadges)
    .set({ seenAt: new Date() })
    .where(and(eq(userBadges.userId, userId), isNull(userBadges.seenAt)));
}
