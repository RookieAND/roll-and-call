import { and, asc, eq, gt, inArray, isNull } from "drizzle-orm";
import { groupBy } from "es-toolkit";

import { db } from "#db/client";
import { isStaleCoordinatedGame } from "#db/modules/games/model/is-stale-coordinated-game";
import { lockGame } from "#db/modules/games/queries/lock-game";
import { gameRounds, games } from "#db/schema";

import { finishGameEarly } from "./finish-game-early";

export type StaleFinishedGame = { serverId: string; gameId: string; gmId: string; title: string };

// 조율형 다회차에서 다음 회차 일시가 30일 동안 정해지지 않은 구인을 자동으로 마친다(사유 stale).
// 하루 한 번 크론(/api/cron/rounds)이 부른다. 잠근 뒤 다시 판정해 그 사이 일시가 정해진 구인은 건너뛴다.
export async function finishStaleCoordinatedGames(
  now: Date = new Date(),
): Promise<StaleFinishedGame[]> {
  const open = await db
    .select({ serverId: games.serverId, gameId: games.id })
    .from(games)
    .where(
      and(
        eq(games.roundScheduleKind, "coordinated"),
        gt(games.roundCount, 1),
        isNull(games.finishedAt),
        isNull(games.cancelledAt),
      ),
    );
  if (open.length === 0) return [];
  const rounds = await db
    .select({
      gameId: gameRounds.gameId,
      startAt: gameRounds.startAt,
      plannedEndAt: gameRounds.plannedEndAt,
      endedAt: gameRounds.endedAt,
    })
    .from(gameRounds)
    .where(
      inArray(
        gameRounds.gameId,
        open.map((game) => game.gameId),
      ),
    )
    .orderBy(asc(gameRounds.roundNo));
  const roundsByGame = groupBy(rounds, (round) => round.gameId);
  const finished: StaleFinishedGame[] = [];
  for (const candidate of open) {
    if (!isStaleCoordinatedGame({ rounds: roundsByGame[candidate.gameId] ?? [], now })) continue;
    const result = await db.transaction(async (transaction) => {
      const game = await lockGame({ transaction, ...candidate });
      if (!game || game.finishedAt || game.cancelledAt) return null;
      const lockedRounds = await transaction
        .select()
        .from(gameRounds)
        .where(eq(gameRounds.gameId, candidate.gameId));
      if (!isStaleCoordinatedGame({ rounds: lockedRounds, now })) return null;
      await finishGameEarly({ transaction, ...candidate, reason: "stale", at: now });
      return { ...candidate, gmId: game.gmId, title: game.title };
    });
    if (result) finished.push(result);
  }
  return finished;
}
