import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 일정 없는(또는 조율 중인) 회차에 일시를 정한다. 조율 기간 값은 기록으로 남긴다.
export async function scheduleRound({
  transaction,
  serverId,
  gameId,
  roundNo,
  startAt,
  plannedEndAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  startAt: Date;
  plannedEndAt: Date;
}): Promise<void> {
  await transaction
    .update(gameRounds)
    .set({ startAt, plannedEndAt, status: "scheduled" })
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
}
