import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { notifications } from "#/schema";

// 이미 읽음·없는 줄·남의 줄이면 false다. 오류가 아니다.
export async function markNotificationRead({
  serverId,
  userId,
  notificationId,
}: {
  serverId: string;
  userId: string;
  notificationId: string;
}) {
  const updated = await db
    .update(notifications)
    .set({ readAt: sql`now()` })
    .where(
      and(
        eq(notifications.id, notificationId),
        eq(notifications.serverId, serverId),
        eq(notifications.userId, userId),
        isNull(notifications.readAt),
      ),
    )
    .returning({ id: notifications.id });
  return updated.length > 0;
}
