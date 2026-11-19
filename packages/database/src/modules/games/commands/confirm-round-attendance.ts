import { and, eq, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds, participants, roundAttendances } from "#db/schema";

export type RoundAttendanceResult = { absentUserIds: string[]; presentUserIds: string[] };

// 다회차 회차의 출석을 확정한다. 지금 확정 참여자 전원이 기본 참석이고, 빠진 사람만 attended = false로 쓴다.
// 다회차에서는 불참 기록(participants.absent)을 쓰지 않는다. 다시 고칠 때도 같은 길로 덮는다.
// 확정한 회차는 finished가 되고, 마지막 회차면 트리거가 구인의 finished_at을 채운다.
export async function confirmRoundAttendance({
  transaction,
  serverId,
  gameId,
  roundNo,
  absentUserIds,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  absentUserIds: readonly string[];
  at: Date;
}): Promise<RoundAttendanceResult | null> {
  const [round] = await transaction
    .update(gameRounds)
    .set({ attendanceConfirmedAt: at, status: "finished" })
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    )
    .returning({ id: gameRounds.id });
  if (!round) return null;
  const roster = await transaction
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    );
  const absent = new Set(absentUserIds);
  const rosterIds = roster.map((row) => row.userId);
  // 그 사이 명단에서 빠진 사람(내보내기·하차)의 이 회차 행은 지우지 않고 그대로 둔다.
  if (rosterIds.length > 0) {
    await transaction
      .insert(roundAttendances)
      .values(
        rosterIds.map((userId) => ({
          serverId,
          roundId: round.id,
          gameId,
          userId,
          attended: !absent.has(userId),
        })),
      )
      .onConflictDoUpdate({
        target: [roundAttendances.roundId, roundAttendances.userId],
        set: { attended: sql`excluded.attended` },
      });
  }
  return {
    absentUserIds: rosterIds.filter((userId) => absent.has(userId)),
    presentUserIds: rosterIds.filter((userId) => !absent.has(userId)),
  };
}
