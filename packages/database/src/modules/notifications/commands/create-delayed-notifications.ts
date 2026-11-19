import { dropOwnNotifications } from "#db/modules/notifications/model/drop-own-notifications";
import type { NotificationInput } from "#db/modules/notifications/model/notification-kind";
import type { Transaction } from "#db/modules/transaction";
import { notifications as notificationsTable } from "#db/schema";

// 되돌리기가 있는 동작의 알림. visibleAt까지 목록·숫자에 보이지 않고, 되돌리면 돌려준 id로 지운다.
export async function createDelayedNotifications({
  transaction,
  serverId,
  actorId,
  notifications,
  visibleAt,
}: {
  transaction: Transaction;
  serverId: string;
  actorId: string | null;
  notifications: NotificationInput[];
  visibleAt: Date;
}): Promise<string[]> {
  const rows = dropOwnNotifications({ actorId, notifications });
  if (rows.length === 0) return [];
  const inserted = await transaction
    .insert(notificationsTable)
    .values(
      rows.map((row) => ({
        serverId,
        userId: row.userId,
        kind: row.kind,
        params: row.params,
        visibleAt,
      })),
    )
    .returning({ id: notificationsTable.id });
  return inserted.map((row) => row.id);
}
