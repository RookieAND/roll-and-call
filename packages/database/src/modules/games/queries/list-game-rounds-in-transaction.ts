import { and, asc, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 잠근 게임 행 아래에서 모든 회차를 번호 순서로 읽는다. 회차 계획을 고치기 전 판단에 쓴다.
export async function listGameRoundsInTransaction({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  return transaction
    .select()
    .from(gameRounds)
    .where(and(eq(gameRounds.serverId, serverId), eq(gameRounds.gameId, gameId)))
    .orderBy(asc(gameRounds.roundNo));
}
