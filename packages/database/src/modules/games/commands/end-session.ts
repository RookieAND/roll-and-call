import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

// 값만 쓴다. 마칠 수 있는지는 잠근 행으로 부르는 쪽이 판단하고, 체크 games_ended_after_start가 한 번 더 막는다.
export async function setSessionEndedAt({
  transaction,
  serverId,
  gameId,
  endedAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  endedAt: Date | null;
}) {
  await transaction
    .update(games)
    .set({ endedAt })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
