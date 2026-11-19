import { and, eq, isNull } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds, participants, roundAttendances } from "#db/schema";

// 시작한 다회차에서 서버를 떠난 확정 참여자를 명단에서 뺀다(server_left, 불참 기록 없음, 완주 아님).
// 지금 진행 중이고 출석 확정 전인 회차는 이번 회차까지 참석으로 남기고, 이후 회차부터 명단(확정 참여자)에서 빠진다.
export async function removeDepartedRoundParticipant({
  transaction,
  serverId,
  gameId,
  userId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  now: Date;
}) {
  const rounds = await transaction
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        isNull(gameRounds.endedAt),
        isNull(gameRounds.attendanceConfirmedAt),
      ),
    );
  const current = rounds.find(
    (round) =>
      round.startAt && round.startAt <= now && (!round.plannedEndAt || round.plannedEndAt > now),
  );
  if (current) {
    await transaction
      .insert(roundAttendances)
      .values({ serverId, roundId: current.id, gameId, userId, attended: true })
      .onConflictDoNothing();
  }
  await transaction
    .update(participants)
    .set({
      status: PARTICIPANT_STATUS.removed,
      absent: false,
      absenceReason: null,
      absenceAt: null,
      leftReason: "server_left",
    })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    );
}
