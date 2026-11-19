import { and, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import { syncFirstRound } from "#db/modules/games/commands/sync-first-round";
import type { Transaction } from "#db/modules/transaction";
import { games, type NewGame } from "#db/schema";

// 바뀐 행이 없으면(남의 글이거나 지워졌거나 취소됐으면) false.
export async function updateOwnedGame({
  transaction,
  serverId,
  gameId,
  gmId,
  columns,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  gmId: string;
  columns: Partial<Omit<NewGame, "id" | "serverId" | "gmId">>;
}) {
  const run = async (executor: Transaction) => {
    const updated = await executor
      .update(games)
      .set(columns)
      .where(
        and(
          eq(games.serverId, serverId),
          eq(games.id, gameId),
          eq(games.gmId, gmId),
          isNull(games.cancelledAt),
        ),
      )
      .returning({ id: games.id });
    if (updated.length === 0) return false;
    await syncFirstRound({ transaction: executor, gameId });
    return true;
  };
  return transaction ? run(transaction) : db.transaction(run);
}
