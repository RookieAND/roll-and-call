import { and, eq, isNull, sql } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

// 세션 시작 뒤 정원 +1은 구인당 한 번이다. 이미 늘렸으면 바꾸지 않고 false.
export async function raiseGameCapacity({
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
  const raised = await transaction
    .update(games)
    .set({ maxPlayers: sql`${games.maxPlayers} + 1`, capacityRaisedAt: at })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.capacityRaisedAt)))
    .returning({ id: games.id });
  return raised.length > 0;
}
