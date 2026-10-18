import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { cancelBlockReason } from "#db/modules/games/model/cancel-block-reason";
import { gameCancelledRecipients } from "#db/modules/games/model/game-cancelled-recipients";
import { storedCancelReason } from "#db/modules/games/model/stored-cancel-reason";
import { lockGame } from "#db/modules/games/queries/lock-game";
import { createNotifications } from "#db/modules/notifications";
import { GAME_CANCEL_KIND, type GameCancelKind } from "#db/modules/notifications/model";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import type { Transaction } from "#db/modules/transaction";
import { games, participants, type Game } from "#db/schema";

export type CancelGameResult =
  | { ok: true; game: Game; notifiedCount: number }
  | { ok: false; reason: "not_found" | "already_cancelled" | "session_started" | "session_ended" };

// GM·운영진·자동 취소가 모두 여기를 지난다. 구인 행과 참여자·가능 시간·후기는 그대로 남는다.
export async function cancelGame({
  transaction,
  serverId,
  gameId,
  kind,
  actorId,
  reason,
  allowStarted = false,
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  kind: GameCancelKind;
  actorId: string | null;
  reason: string | null;
  allowStarted?: boolean;
  now?: Date;
}): Promise<CancelGameResult> {
  const run = async (tx: Transaction): Promise<CancelGameResult> => {
    const game = await lockGame({ transaction: tx, serverId, gameId });
    if (!game) return { ok: false, reason: "not_found" };
    const blocked = cancelBlockReason({ game, now, allowStarted });
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
    const roster = await tx
      .select({ userId: participants.userId, status: participants.status })
      .from(participants)
      .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
    const params = {
      gameId,
      gameTitle: cancelled!.title,
      cancelKind: kind,
      reason: kind === GAME_CANCEL_KIND.gm ? cancelled!.cancelReason : null,
    };
    const notifiedCount = await createNotifications({
      executor: tx,
      serverId,
      actorId,
      notifications: gameCancelledRecipients({ game: cancelled!, kind, roster }).map((userId) => ({
        userId,
        kind: NOTIFICATION_KIND.gameCancelled,
        params,
      })),
    });
    return { ok: true, game: cancelled!, notifiedCount };
  };
  return transaction ? run(transaction) : db.transaction(run);
}
