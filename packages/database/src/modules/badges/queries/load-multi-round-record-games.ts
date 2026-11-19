import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { miniRuleOf } from "#db/modules/badges/model/mini-rule-of";
import { multiRoundAbsences } from "#db/modules/badges/model/multi-round-absences";
import { multiRoundRecordGames } from "#db/modules/badges/model/multi-round-record-games";

import { loadRoundAttendanceData } from "./load-round-attendance-data";

export async function loadMultiRoundRecordGames({ serverId }: { serverId: string }) {
  const rows = await db.query.games.findMany({
    columns: { id: true, gmId: true, hiddenAt: true, cancelledAt: true },
    where: (game, { isNull }) =>
      and(
        eq(game.serverId, serverId),
        sql`${game.roundCount} > 1`,
        isNull(game.hiddenAt),
        isNull(game.cancelledAt),
      ),
    with: {
      rulebook: { columns: {}, with: { category: { columns: { miniRule: true } } } },
      participants: {
        columns: {
          userId: true,
          status: true,
          absent: true,
          absenceCancelledAt: true,
          leftReason: true,
          absenceAt: true,
        },
        where: (participant) => eq(participant.serverId, serverId),
      },
    },
  });
  const gameIds = rows.map((row) => row.id);
  if (gameIds.length === 0) return { games: [], absences: [] };
  const { rounds, attendedByRound } = await loadRoundAttendanceData({ gameIds });
  const built = rows.map(({ id, rulebook, participants: people, ...game }) => {
    const gameRoundRows = rounds
      .filter((round) => round.gameId === id)
      .map((round) => ({ ...round, startAt: round.startAt! }));
    const input = {
      game: { ...game, id, miniRule: miniRuleOf({ rulebook }) },
      rounds: gameRoundRows,
      participants: people,
      attendedByRound,
    };
    return gameRoundRows.length === 0
      ? { games: [], absences: [] }
      : { games: multiRoundRecordGames(input), absences: multiRoundAbsences(input) };
  });
  return {
    games: built.flatMap((entry) => entry.games),
    absences: built.flatMap((entry) => entry.absences),
  };
}
