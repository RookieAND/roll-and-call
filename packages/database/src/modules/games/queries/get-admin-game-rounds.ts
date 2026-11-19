import { and, asc, eq } from "drizzle-orm";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { gameRoundSkips, gameRounds, games, profiles, roundAttendances } from "#db/schema";

// 어드민 구인 상세의 「회차」 구역. 회차가 여러 개인 구인만 값이 있다.
export async function getAdminGameRounds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [game] = await db
    .select({ roundCount: games.roundCount, scheduleKind: games.roundScheduleKind })
    .from(games)
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!game || game.roundCount <= 1) return null;

  const [rounds, attendances, skips] = await Promise.all([
    db
      .select({
        id: gameRounds.id,
        roundNo: gameRounds.roundNo,
        status: gameRounds.status,
        startAt: gameRounds.startAt,
        plannedEndAt: gameRounds.plannedEndAt,
        endedAt: gameRounds.endedAt,
        attendanceConfirmedAt: gameRounds.attendanceConfirmedAt,
      })
      .from(gameRounds)
      .where(and(eq(gameRounds.serverId, serverId), eq(gameRounds.gameId, gameId)))
      .orderBy(asc(gameRounds.roundNo)),
    db
      .select({
        roundId: roundAttendances.roundId,
        userId: roundAttendances.userId,
        attended: roundAttendances.attended,
        nickname: memberNicknameSql(serverId),
      })
      .from(roundAttendances)
      .innerJoin(profiles, eq(profiles.id, roundAttendances.userId))
      .where(and(eq(roundAttendances.serverId, serverId), eq(roundAttendances.gameId, gameId)))
      .orderBy(asc(profiles.username)),
    db
      .select({
        roundNo: gameRoundSkips.roundNo,
        originalStartAt: gameRoundSkips.originalStartAt,
        originalPlannedEndAt: gameRoundSkips.originalPlannedEndAt,
        skippedAt: gameRoundSkips.skippedAt,
      })
      .from(gameRoundSkips)
      .where(and(eq(gameRoundSkips.serverId, serverId), eq(gameRoundSkips.gameId, gameId)))
      .orderBy(asc(gameRoundSkips.originalStartAt)),
  ]);

  return {
    scheduleKind: game.scheduleKind,
    roundCount: game.roundCount,
    rounds: rounds.map(({ id, ...round }) => ({
      ...round,
      attendees: attendances
        .filter((attendance) => attendance.roundId === id)
        .map(({ userId, nickname, attended }) => ({ userId, nickname, attended })),
    })),
    skips,
  };
}

export type AdminGameRounds = NonNullable<Awaited<ReturnType<typeof getAdminGameRounds>>>;
