import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

export async function closeGameRecruitment({
  transaction,
  serverId,
  gameId,
  endDate,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  endDate: Date;
}) {
  await transaction
    .update(games)
    .set({ endDate })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
