import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

export async function setDrawRoll({
  transaction,
  serverId,
  gameId,
  userId,
  drawRoll,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  drawRoll: number;
}) {
  await transaction
    .update(participants)
    .set({ drawRoll })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
