import { and, count, isNull } from "drizzle-orm";

import { db } from "#/client";
import { notifications } from "#/schema";

import { visibleNotificationsWhere } from "./visible-notifications-where";

export async function countUnreadNotifications({
  serverId,
  userId,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  now?: Date;
}) {
  const [row] = await db
    .select({ total: count() })
    .from(notifications)
    .where(and(visibleNotificationsWhere({ serverId, userId, now }), isNull(notifications.readAt)));
  return row?.total ?? 0;
}
