import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 회차 하나를 읽는다. 쓰기 전 판단이면 잠근 게임 행과 같은 트랜잭션을 넘긴다(회차 쓰기는 게임 행 잠금으로 줄을 선다).
export async function findGameRound({
  transaction,
  serverId,
  gameId,
  roundNo,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
}) {
  const [round] = await (transaction ?? db)
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
