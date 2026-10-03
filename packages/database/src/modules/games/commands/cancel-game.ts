import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { cancelBlockReason } from "#/modules/games/model/cancel-block-reason";
import type { GameCancelKind } from "#/modules/games/model/game-cancel-kind";
import { storedCancelReason } from "#/modules/games/model/stored-cancel-reason";
import { lockGame } from "#/modules/games/queries/lock-game";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, type Game } from "#/schema";

export type CancelGameResult =
  | { ok: true; game: Game }
  | { ok: false; reason: "not_found" | "already_cancelled" | "session_ended" };

// GM·운영진·자동 취소가 모두 여기를 지난다. 구인 행과 참여자·가능 시간·후기는 그대로 남는다.
export async function cancelGame({
  transaction,
  serverId,
  gameId,
  kind,
  actorId,
  reason,
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  kind: GameCancelKind;
  actorId: string | null;
  reason: string | null;
  now?: Date;
}): Promise<CancelGameResult> {
  const run = async (tx: Transaction): Promise<CancelGameResult> => {
    const game = await lockGame({ transaction: tx, serverId, gameId });
    if (!game) return { ok: false, reason: "not_found" };
    const blocked = cancelBlockReason({ game, now });
    if (blocked) return { ok: false, reason: blocked };
    const [cancelled] = await tx
      .update(games)
      .set({
        cancelledAt: now,
        cancelledBy: actorId,
        cancelKind: kind,
        cancelReason: storedCancelReason({ kind, reason }),
      })
      .where(and(eq(games.serverId, serverId), eq(games.id, gameId)))
      .returning();
    return { ok: true, game: cancelled! };
  };
  return transaction ? run(transaction) : db.transaction(run);
}
