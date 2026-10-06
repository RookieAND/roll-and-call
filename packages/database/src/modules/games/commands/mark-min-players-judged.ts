import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

export async function markMinPlayersJudged({
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
    .set({ minPlayersJudgedAt: at })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
