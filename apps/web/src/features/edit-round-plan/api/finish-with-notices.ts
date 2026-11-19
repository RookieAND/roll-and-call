import "server-only";
import type { Game } from "@roll-and-call/database";
import { finishGameEarly, listRosterFinishers } from "@roll-and-call/database/games";
import { gameFinishedEarlyNotices } from "@roll-and-call/database/games/model";
import { createNotifications } from "@roll-and-call/database/notifications";
import type { Transaction } from "@roll-and-call/database/transaction";

// GM이 마친 조기 종결(manual)과 참여자 알림. [여기서 마치기]와 회차 수를 시작한 회차 수로 줄이기가 함께 쓴다.
export async function finishWithNotices({
  transaction,
  serverId,
  game,
  lastRoundNo,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  game: Game;
  lastRoundNo: number;
  at: Date;
}) {
  await finishGameEarly({ transaction, serverId, gameId: game.id, reason: "manual", at });
  const roster = await listRosterFinishers({ executor: transaction, serverId, gameId: game.id });
  await createNotifications({
    executor: transaction,
    serverId,
    actorId: game.gmId,
    notifications: gameFinishedEarlyNotices({
      game: { id: game.id, title: game.title },
      roster,
      reason: "manual",
      roundNo: lastRoundNo,
    }),
  });
}
