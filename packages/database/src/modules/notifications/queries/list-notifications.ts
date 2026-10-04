import { and, desc, sql } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#/client";
import { decodeNotificationCursor } from "#/modules/notifications/model/decode-notification-cursor";
import { encodeNotificationCursor } from "#/modules/notifications/model/encode-notification-cursor";
import { isNotificationKind } from "#/modules/notifications/model/is-notification-kind";
import type { NotificationPayload } from "#/modules/notifications/model/notification-kind";
import { notifications } from "#/schema";

import { visibleNotificationsWhere } from "./visible-notifications-where";

export type NotificationRow = NotificationPayload & {
  id: string;
  createdAt: Date;
  readAt: Date | null;
};

// 커서는 마지막 줄의 (created_at, id) 키셋이다. 같은 트랜잭션에서 넣은 줄은 created_at이 같아 id가 순서를 정한다.
export async function listNotifications({
  serverId,
  userId,
  cursor,
  limit = 20,
  now = new Date(),
}: {
  serverId: string;
  userId: string;
  cursor: string | null;
  limit?: number;
  now?: Date;
}): Promise<{ items: NotificationRow[]; nextCursor: string | null }> {
  const after = decodeNotificationCursor(cursor);
  const rows = await db
    .select({
      id: notifications.id,
      kind: notifications.kind,
      params: notifications.params,
      createdAt: notifications.createdAt,
      readAt: notifications.readAt,
      cursorAt: sql<string>`to_char(${notifications.createdAt} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')`,
    })
    .from(notifications)
    .where(
      and(
        visibleNotificationsWhere({ serverId, userId, now }),
        isNull(after)
          ? undefined
          : sql`(${notifications.createdAt}, ${notifications.id}) < (${after.at}::timestamptz, ${after.id}::uuid)`,
      ),
    )
    .orderBy(desc(notifications.createdAt), desc(notifications.id))
    .limit(limit + 1);

  const page = rows.slice(0, limit);
  const last = page.at(-1);
  const nextCursor =
    rows.length > limit && last
      ? encodeNotificationCursor({ at: last.cursorAt, id: last.id })
      : null;
  const items = page.flatMap(({ cursorAt: _cursorAt, kind, params, ...row }) =>
    isNotificationKind(kind) ? [{ ...row, kind, params } as NotificationRow] : [],
  );
  return { items, nextCursor };
}
