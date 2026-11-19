import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "#db/client";
import { gameRounds, roundAttendances } from "#db/schema";

export async function loadRoundAttendanceData({ gameIds }: { gameIds: string[] }) {
  const rounds = await db
    .select({
      id: gameRounds.id,
      gameId: gameRounds.gameId,
      startAt: gameRounds.startAt,
      plannedEndAt: gameRounds.plannedEndAt,
      endedAt: gameRounds.endedAt,
      attendanceConfirmedAt: gameRounds.attendanceConfirmedAt,
    })
    .from(gameRounds)
    .where(and(inArray(gameRounds.gameId, gameIds), sql`${gameRounds.startAt} is not null`));
  const attendances = await db
    .select({ roundId: roundAttendances.roundId, userId: roundAttendances.userId })
    .from(roundAttendances)
    .where(and(inArray(roundAttendances.gameId, gameIds), eq(roundAttendances.attended, true)));
  const attendedByRound = new Map<string, Set<string>>();
  for (const { roundId, userId } of attendances) {
    attendedByRound.set(roundId, (attendedByRound.get(roundId) ?? new Set()).add(userId));
  }
  return { rounds, attendedByRound };
}
