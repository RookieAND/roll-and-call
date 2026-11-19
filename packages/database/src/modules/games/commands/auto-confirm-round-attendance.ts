import { and, eq, gt, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "#db/client";
import { ATTENDANCE_EDIT_HOURS } from "#db/modules/games/model/attendance-deadline";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { roundAttendanceDeadline } from "#db/modules/games/model/round-attendance-deadline";
import { lockGame } from "#db/modules/games/queries/lock-game";
import { gameRounds, games, participants, roundAttendances } from "#db/schema";

export type AutoConfirmedRound = {
  serverId: string;
  gameId: string;
  gmId: string;
  title: string;
  roundNo: number;
};

// 다회차 회차 중 종료 24시간이 지나도록 출석을 확정하지 않은 회차를 확정한다. 확정 참여자 전원이 참석이고,
// 확정 시각은 기한 시각으로 남겨 자동 확정인지 가릴 수 있다. 단발은 autoConfirmAttendance가 맡는다.
// 매시 5분 크론(/api/cron/attendance)이 부른다. 한 번에 limit개 회차만 집고 나머지는 다음 실행이 집는다.
export async function autoConfirmRoundAttendance(
  now: Date = new Date(),
  limit = 50,
): Promise<AutoConfirmedRound[]> {
  const deadline = sql`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt}) + ${ATTENDANCE_EDIT_HOURS} * interval '1 hour'`;
  const candidates = await db
    .select({
      serverId: gameRounds.serverId,
      gameId: gameRounds.gameId,
      roundNo: gameRounds.roundNo,
    })
    .from(gameRounds)
    .innerJoin(games, eq(games.id, gameRounds.gameId))
    .where(
      and(
        gt(games.roundCount, 1),
        isNull(games.cancelledAt),
        isNotNull(gameRounds.startAt),
        isNull(gameRounds.attendanceConfirmedAt),
        lte(deadline, now),
      ),
    )
    .limit(limit);
  const confirmed: AutoConfirmedRound[] = [];
  for (const candidate of candidates) {
    const result = await db.transaction(async (transaction) => {
      const game = await lockGame({
        transaction,
        serverId: candidate.serverId,
        gameId: candidate.gameId,
      });
      const [round] = await transaction
        .select()
        .from(gameRounds)
        .where(
          and(
            eq(gameRounds.gameId, candidate.gameId),
            eq(gameRounds.roundNo, candidate.roundNo),
            isNull(gameRounds.attendanceConfirmedAt),
          ),
        );
      const at = round && roundAttendanceDeadline(round);
      if (!game || !round || !at || at.getTime() > now.getTime()) return null;
      await transaction
        .update(gameRounds)
        .set({ attendanceConfirmedAt: at, status: "finished" })
        .where(eq(gameRounds.id, round.id));
      const roster = await transaction
        .select({ userId: participants.userId })
        .from(participants)
        .where(
          and(
            eq(participants.gameId, candidate.gameId),
            eq(participants.status, PARTICIPANT_STATUS.confirmed),
          ),
        );
      if (roster.length > 0) {
        await transaction
          .insert(roundAttendances)
          .values(
            roster.map(({ userId }) => ({
              serverId: candidate.serverId,
              roundId: round.id,
              gameId: candidate.gameId,
              userId,
              attended: true,
            })),
          )
          .onConflictDoNothing();
      }
      return { ...candidate, gmId: game.gmId, title: game.title };
    });
    if (result) confirmed.push(result);
  }
  return confirmed;
}
