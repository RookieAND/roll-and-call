import { isRoundKickAbsence } from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import type { CountingNoShow } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildCountingNoShows({ tables }: ShapeContext): CountingNoShow[] {
  const gameOf = new Map(tables.gameRows.map((game) => [game.id, game]));
  const counts = (row: (typeof tables.participantRows)[number]) => {
    const game = gameOf.get(row.gameId);
    if (!game) return false;
    if (game.roundCount > 1) return isRoundKickAbsence({ ...row, absenceCancelledAt: null });
    return row.absent && Boolean(game.attendanceConfirmedAt);
  };
  return tables.participantRows.filter(counts).map((row) => ({
    userId: row.userId,
    sessionId: row.gameId,
    absenceAt: row.absenceAt ?? undefined,
    cancelled: !isNull(row.absenceCancelledAt),
  }));
}
