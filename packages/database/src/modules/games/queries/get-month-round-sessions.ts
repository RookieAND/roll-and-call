import { and, asc, eq, gte, inArray, isNotNull, lt, notInArray } from "drizzle-orm";

import { db } from "#db/client";
import { gameRounds, games } from "#db/schema";

import { findMonthGames } from "./get-month-sessions";

// 달력용: 달 안에 일시가 있는 회차마다 한 행. 단발 구인은 회차 1개라 getMonthSessions와 같게 나온다.
// 아직 일시가 없는(unscheduled) 회차와 취소(cancelling)된 회차는 뺀다. 조율을 다시 하는 회차는 원래 일시로 남긴다.
export async function getMonthRoundSessions({
  serverId,
  from,
  to,
}: {
  serverId: string;
  from: Date;
  to: Date;
}) {
  const rounds = await db
    .select({ gameId: gameRounds.gameId, roundNo: gameRounds.roundNo, startAt: gameRounds.startAt })
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        isNotNull(gameRounds.startAt),
        gte(gameRounds.startAt, from),
        lt(gameRounds.startAt, to),
        notInArray(gameRounds.status, ["unscheduled", "cancelling"]),
      ),
    )
    .orderBy(asc(gameRounds.startAt));
  if (rounds.length === 0) return [];

  const found = await findMonthGames({
    serverId,
    where: inArray(games.id, [...new Set(rounds.map((round) => round.gameId))]),
    includeCancelled: false,
  });
  const byId = new Map(found.map((game) => [game.id, game]));
  return rounds.flatMap(({ gameId, roundNo, startAt }) => {
    const game = byId.get(gameId);
    return game ? [{ ...game, roundNo, roundStartAt: startAt! }] : [];
  });
}

export type MonthRoundSessionRow = Awaited<ReturnType<typeof getMonthRoundSessions>>[number];
