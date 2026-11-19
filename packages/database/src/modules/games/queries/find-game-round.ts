import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 잠근 게임 행 아래에서 회차 하나를 읽는다. 회차 쓰기는 게임 행 잠금으로 줄을 선다.
export async function findGameRound({
  transaction,
  serverId,
  gameId,
  roundNo,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
}) {
  const [round] = await transaction
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
  return round ?? null;
}
