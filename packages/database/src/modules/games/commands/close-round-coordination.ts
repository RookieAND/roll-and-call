import { and, eq, sql } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 가능 시간 모으기를 닫는다. 일시가 있으면 scheduled, 없으면 unscheduled로 돌아가고 응답은 남긴다.
export async function closeRoundCoordination({
  transaction,
  serverId,
  gameId,
  roundNo,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
}): Promise<void> {
  await transaction
    .update(gameRounds)
    .set({
      status: sql`case when ${gameRounds.startAt} is null then 'unscheduled'::round_status else 'scheduled'::round_status end`,
    })
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
        eq(gameRounds.status, "coordinating"),
      ),
    );
}
