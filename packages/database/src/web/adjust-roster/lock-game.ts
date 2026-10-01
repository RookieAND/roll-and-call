import { and, eq } from "drizzle-orm";

import { games } from "../../schema";
import type { Transaction } from "../transaction/transaction";

// 같은 게임을 건드리는 신청·명단 조정·출석이 이 행 잠금에서 줄을 선다.
export async function lockGame({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  const [game] = await transaction
    .select()
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)))
    .for("update");
  return game;
}
