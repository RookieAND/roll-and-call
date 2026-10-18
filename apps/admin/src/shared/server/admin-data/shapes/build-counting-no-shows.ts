import { isNull } from "es-toolkit";

import type { CountingNoShow } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildCountingNoShows({ tables }: ShapeContext): CountingNoShow[] {
  const confirmedGameIds = new Set(
    tables.gameRows.filter((game) => game.attendanceConfirmedAt).map((game) => game.id),
  );
  return tables.participantRows
    .filter((row) => row.absent && confirmedGameIds.has(row.gameId))
    .map((row) => ({
      userId: row.userId,
      sessionId: row.gameId,
      cancelled: !isNull(row.absenceCancelledAt),
    }));
}
