import { and, asc, eq } from "drizzle-orm";

import { db } from "#db/client";
import { gameRounds } from "#db/schema";

// 일시가 없는 회차(미정·조율 중)까지 모든 회차를 번호 순서로 돌려준다. 상세 화면의 회차 일정이 쓴다.
export async function listGameRounds({ serverId, gameId }: { serverId: string; gameId: string }) {
  return db
    .select({
      roundNo: gameRounds.roundNo,
      status: gameRounds.status,
      startAt: gameRounds.startAt,
      plannedEndAt: gameRounds.plannedEndAt,
      endedAt: gameRounds.endedAt,
      attendanceConfirmedAt: gameRounds.attendanceConfirmedAt,
      coordinationStart: gameRounds.coordinationStart,
      coordinationEnd: gameRounds.coordinationEnd,
      coordinationWindowStartHour: gameRounds.coordinationWindowStartHour,
      coordinationWindowEndHour: gameRounds.coordinationWindowEndHour,
    })
    .from(gameRounds)
    .where(and(eq(gameRounds.serverId, serverId), eq(gameRounds.gameId, gameId)))
    .orderBy(asc(gameRounds.roundNo));
}

export type GameRoundRow = Awaited<ReturnType<typeof listGameRounds>>[number];
