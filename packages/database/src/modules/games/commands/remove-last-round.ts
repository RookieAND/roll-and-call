import { and, eq, gt, sql } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

// 방금 덧붙인 지정형 회차를 되돌린다. 맨 뒤 회차이고 아직 시작하지 않았으며 3회 이상일 때만 지우고 예정 회차 수를 1 줄인다.
// 부르는 쪽이 게임 행을 잠근다.
export async function removeLastRound({
  transaction,
  serverId,
  gameId,
  roundNo,
  now = new Date(),
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  now?: Date;
}): Promise<boolean> {
  const [game] = await transaction
    .select({ roundCount: games.roundCount, incompleteAt: games.incompleteAt })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game || game.incompleteAt || game.roundCount !== roundNo || roundNo <= 2) return false;
  const [removed] = await transaction
    .delete(gameRounds)
    .where(
      and(
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
        gt(gameRounds.startAt, now),
      ),
    )
    .returning({ id: gameRounds.id });
  if (!removed) return false;
  await transaction
    .update(games)
    .set({ roundCount: sql`${games.roundCount} - 1` })
    .where(eq(games.id, gameId));
  return true;
}
