import { and, eq, gte, inArray, lt, sql } from "drizzle-orm";

import { db } from "#db/client";
import { multiRoundRecordGames } from "#db/modules/badges/model/multi-round-record-games";
import { findMonthGames } from "#db/modules/games/queries/get-month-sessions";
import { gameRounds, games } from "#db/schema";

import { loadRoundAttendanceData } from "./load-round-attendance-data";

// 홈 이달의 기록용: 달 안에서 시작한 다회차 날짜 묶음마다 한 행. 단발 구인은 getMonthSessions가 담당한다.
export async function loadMonthMultiRoundRows({
  serverId,
  from,
  to,
}: {
  serverId: string;
  from: Date;
  to: Date;
}) {
  const inMonth = await db
    .selectDistinct({ gameId: gameRounds.gameId })
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        gte(gameRounds.startAt, from),
        lt(gameRounds.startAt, to),
      ),
    );
  if (inMonth.length === 0) return [];
  const gameIds = inMonth.map((row) => row.gameId);
  const found = await findMonthGames({
    serverId,
    where: and(inArray(games.id, gameIds), sql`${games.roundCount} > 1`),
    includeCancelled: false,
  });
  if (found.length === 0) return [];
  const { rounds, attendedByRound } = await loadRoundAttendanceData({
    gameIds: found.map((game) => game.id),
  });
  return found.flatMap((row) => {
    const game = row;
    const people = new Map(
      row.participants.map((participant) => [participant.userId, participant]),
    );
    const records = multiRoundRecordGames({
      game: {
        id: game.id,
        gmId: game.gmId,
        hiddenAt: game.hiddenAt,
        cancelledAt: game.cancelledAt,
      },
      rounds: rounds
        .filter((round) => round.gameId === game.id)
        .map((round) => ({ ...round, startAt: round.startAt! })),
      participants: row.participants.map((participant) => ({
        ...participant,
        leftReason: null,
        absenceAt: null,
      })),
      attendedByRound,
    });
    return records
      .filter((record) => {
        const startsAt = record.confirmedAt as Date;
        return startsAt >= from && startsAt < to;
      })
      .map((record) => ({
        ...row,
        confirmedAt: record.confirmedAt as Date,
        endedAt: record.endedAt as Date | null,
        playMinutes: null,
        participants: record.participants.map((participant) => people.get(participant.userId)!),
      }));
  });
}
