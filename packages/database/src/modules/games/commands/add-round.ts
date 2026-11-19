import { and, eq, isNull, sql } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

// 지정형 다회차에 회차를 하나 덧붙이고 예정 회차 수를 1 늘린다. 같은 구인의 회차와 겹치면 데이터베이스가 거부한다.
// 마지막 회차 출석을 확정하기 전까지만 허용하는 판단은 부르는 쪽이 한다. 새 회차 번호를 돌려준다.
export async function addRound({
  transaction,
  serverId,
  gameId,
  startAt,
  plannedEndAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  startAt: Date;
  plannedEndAt: Date;
}): Promise<number> {
  const [game] = await transaction
    .update(games)
    .set({ roundCount: sql`${games.roundCount} + 1` })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.incompleteAt)))
    .returning({ roundCount: games.roundCount });
  if (!game) throw new Error("addRound: game not found or already finished");
  await transaction.insert(gameRounds).values({
    serverId,
    gameId,
    roundNo: game.roundCount,
    startAt,
    plannedEndAt,
    status: "scheduled",
  });
  return game.roundCount;
}
