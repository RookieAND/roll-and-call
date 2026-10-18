import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

// 지운 행이 없으면 false.
export async function deleteParticipant({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const removed = await (transaction ?? db)
    .delete(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    )
    .returning({ status: participants.status });
  return removed.length > 0;
}
