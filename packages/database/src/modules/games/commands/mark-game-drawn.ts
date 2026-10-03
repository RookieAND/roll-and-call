import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

export async function markGameDrawn({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  await transaction
    .update(games)
    .set({ drawnAt: new Date() })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
