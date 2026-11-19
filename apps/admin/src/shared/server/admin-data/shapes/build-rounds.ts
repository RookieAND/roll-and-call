import type { RoundSlot } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildRounds({ tables }: ShapeContext): RoundSlot[] {
  return tables.roundRows.map((round) => ({
    gameId: round.gameId,
    startsAt: round.startAt!,
    endsAt: round.endedAt ?? round.plannedEndAt,
    attendanceConfirmedAt: round.attendanceConfirmedAt ?? undefined,
  }));
}
