import { and, eq, isNull, lte } from "drizzle-orm";

import { gameFinishedEarlyNotices } from "#db/modules/games/model/game-finished-early-notices";
import { listRosterFinishers } from "#db/modules/games/queries/list-roster-finishers";
import { createNotifications } from "#db/modules/notifications";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

import { endRound } from "./end-round";
import { finishGameEarly } from "./finish-game-early";

// 진행 중인 다회차의 GM이 서버를 떠났다. 진행 중인 회차는 지금 마치고 구인을 조기 종결(manual)해 참여자에게 알린다.
// 마지막 회차를 마쳐 구인이 이미 끝났으면 조기 종결이 아니다.
export async function finishDepartedGmGame({
  transaction,
  serverId,
  gameId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  now: Date;
}) {
  const started = await transaction
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        lte(gameRounds.startAt, now),
      ),
    );
  const lastRoundNo = Math.max(...started.map((round) => round.roundNo));
  const current = started.find(
    (round) => !round.endedAt && (!round.plannedEndAt || round.plannedEndAt > now),
  );
  if (current) {
    await endRound({ transaction, serverId, gameId, roundNo: current.roundNo, endedAt: now });
  }
  const [game] = await transaction
    .select()
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.finishedAt)));
  if (!game) return false;
  await finishGameEarly({ transaction, serverId, gameId, reason: "manual", at: now });
  const roster = await listRosterFinishers({ executor: transaction, serverId, gameId });
  await createNotifications({
    executor: transaction,
    serverId,
    actorId: null,
    notifications: gameFinishedEarlyNotices({
      game: { id: game.id, title: game.title },
      roster,
      reason: "manual",
      roundNo: lastRoundNo,
    }),
  });
  return true;
}
