import { and, eq, gt, inArray } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { notifications } from "#db/schema";

// 되돌린 동작의 알림을 지운다. 이미 보이기 시작한 알림(visible_at이 지남)은 받은 사람이 봤을 수 있어 남긴다.
export async function withdrawDelayedNotifications({
  transaction,
  serverId,
  ids,
  now = new Date(),
}: {
  transaction: Transaction;
  serverId: string;
  ids: readonly string[];
  now?: Date;
}): Promise<number> {
  if (ids.length === 0) return 0;
  const removed = await transaction
    .delete(notifications)
    .where(
      and(
        eq(notifications.serverId, serverId),
        inArray(notifications.id, [...ids]),
        gt(notifications.visibleAt, now),
      ),
    )
    .returning({ id: notifications.id });
  return removed.length;
}
