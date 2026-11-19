import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// GM이 회차를 마친다. 마친 회차는 finished이고, 마지막 회차면 트리거가 구인의 finished_at을 채운다.
// 마칠 수 있는지는 부르는 쪽이 잠근 게임 행으로 판단하고, 체크 game_rounds_ended_after_start가 한 번 더 막는다.
export async function endRound({
  transaction,
  serverId,
  gameId,
  roundNo,
  endedAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  endedAt: Date;
}) {
  await transaction
    .update(gameRounds)
    .set({ endedAt, status: "finished" })
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
}
