import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { games, type GameRepeatRule } from "#db/schema";

export async function setRepeatRule({
  transaction,
  serverId,
  gameId,
  repeatRule,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  repeatRule: GameRepeatRule | null;
}): Promise<void> {
  await transaction
    .update(games)
    .set({ repeatRule })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
