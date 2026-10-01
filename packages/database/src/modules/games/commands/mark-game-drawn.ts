import { and, eq } from "drizzle-orm";

import { games } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";

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
