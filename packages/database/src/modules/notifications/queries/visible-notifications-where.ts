import { and, eq, gt, inArray } from "drizzle-orm";

import { NOTIFICATION_KINDS } from "#/modules/notifications/model/is-notification-kind";
import { NOTIFICATION_RETENTION_DAYS } from "#/modules/notifications/model/notification-retention";
import { notifications } from "#/schema";

const DAY_MS = 86_400_000;

// 목록·안 읽은 수·모두 읽음이 같은 조건을 써야 [알림 N]과 목록의 안 읽음 줄 수가 맞는다.
export function visibleNotificationsWhere({
  serverId,
  userId,
  now,
}: {
  serverId: string;
  userId: string;
  now: Date;
}) {
  return and(
    eq(notifications.serverId, serverId),
    eq(notifications.userId, userId),
    gt(notifications.createdAt, new Date(now.getTime() - NOTIFICATION_RETENTION_DAYS * DAY_MS)),
    inArray(notifications.kind, [...NOTIFICATION_KINDS]),
  );
}
