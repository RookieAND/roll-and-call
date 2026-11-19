import { and, eq, gt, isNull } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

// 예정 회차 수를 바꾼다. 줄이면 뒤에서부터 아직 시작하지 않은 회차를 지우고, 조율형을 늘리면 일시 없는 회차를 덧붙인다.
// 지정형을 늘리는 것은 일시가 있어야 해서 addRound로 한다. 판정(roundCountChange)과 시작한 회차 확인은 부르는 쪽이 한다.
export async function setRoundCount({
  transaction,
  serverId,
  gameId,
  current,
  next,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  current: number;
  next: number;
}) {
  if (next < current) {
    await transaction
      .delete(gameRounds)
      .where(
        and(
          eq(gameRounds.serverId, serverId),
          eq(gameRounds.gameId, gameId),
          gt(gameRounds.roundNo, next),
        ),
      );
  } else {
    await transaction.insert(gameRounds).values(
      Array.from({ length: next - current }, (_, index) => ({
        serverId,
        gameId,
        roundNo: current + index + 1,
        status: "unscheduled" as const,
      })),
    );
  }
  await transaction
    .update(games)
    .set({ roundCount: next })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.incompleteAt)));
}
