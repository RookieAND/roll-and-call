import type { db } from "#/client";
import { dropOwnNotifications } from "#/modules/notifications/model/drop-own-notifications";
import type { NotificationInput } from "#/modules/notifications/model/notification-kind";
import type { Transaction } from "#/modules/transaction/transaction";
import { notifications as notificationsTable } from "#/schema";

// 알림은 도메인 변경과 같은 트랜잭션에서 넣는다. 디스코드 발송처럼 after()로 미루지 않는다.
export async function createNotifications({
  executor,
  serverId,
  actorId,
  notifications,
}: {
  executor: typeof db | Transaction;
  serverId: string;
  actorId: string | null;
  notifications: NotificationInput[];
}): Promise<number> {
  const rows = dropOwnNotifications({ actorId, notifications });
  if (rows.length === 0) return 0;
  await executor.insert(notificationsTable).values(
    rows.map((row) => ({
      serverId,
      userId: row.userId,
      kind: row.kind,
      params: row.params,
    })),
  );
  return rows.length;
}
