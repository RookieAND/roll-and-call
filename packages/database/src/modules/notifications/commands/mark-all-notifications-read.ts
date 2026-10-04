import { and, isNull, lte, sql } from "drizzle-orm";

import { db } from "#/client";
import { visibleNotificationsWhere } from "#/modules/notifications/queries/visible-notifications-where";
import { notifications } from "#/schema";

// upTo는 화면이 목록을 읽은 시각이다. 화면을 연 뒤 새로 생긴 알림은 보지 않았으니 안 읽음으로 둔다.
export async function markAllNotificationsRead({
  serverId,
  userId,
  upTo,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  upTo: Date;
  now?: Date;
}) {
  const updated = await db
    .update(notifications)
    .set({ readAt: sql`now()` })
    .where(
      and(
        visibleNotificationsWhere({ serverId, userId, now }),
        isNull(notifications.readAt),
        lte(notifications.createdAt, upTo),
      ),
    )
    .returning({ id: notifications.id });
  return updated.length;
}
