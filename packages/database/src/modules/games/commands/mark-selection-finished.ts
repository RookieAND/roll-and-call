import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { games } from "#db/schema";

export async function markSelectionFinished({
  transaction,
  serverId,
  gameId,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  at: Date;
}) {
  await transaction
    .update(games)
    .set({ selectionFinishedAt: at, minPlayersJudgedAt: at })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
