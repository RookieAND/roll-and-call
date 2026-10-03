import { and, eq, exists, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "../../../client";
import { games, participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";
import { ATTENDANCE_EDIT_DAYS, attendanceDeadline } from "../model/attendance-deadline";
import { PARTICIPANT_STATUS } from "../model/participant-status";
import { DEFAULT_PLAY_MINUTES } from "../model/session-ends-at";
import { shouldAutoConfirmAttendance } from "../model/should-auto-confirm-attendance";
import { listParticipantUserIds } from "../queries/list-participant-user-ids";
import { saveAttendance } from "./save-attendance";

export type AutoConfirmedGame = { serverId: string; gameId: string; gmId: string; title: string };

// 한 구인의 확정 참여자 전원을 출석으로 저장한다. 출석 확정 시각은 기한 시각이라 자동 확정인지 나중에 가릴 수 있다.
// onlyPastDeadline이 false면(GM이 서버를 나간 진행 중 세션) 기한을 기다리지 않는다.
export async function autoConfirmAttendanceForGame({
  transaction,
  gameId,
  now = new Date(),
  onlyPastDeadline = false,
}: {
  transaction?: Transaction;
  gameId: string;
  now?: Date;
  onlyPastDeadline?: boolean;
}): Promise<AutoConfirmedGame | null> {
  const run = async (tx: Transaction): Promise<AutoConfirmedGame | null> => {
    const [game] = await tx.select().from(games).where(eq(games.id, gameId)).for("update");
    if (!game) return null;
    const serverId = game.serverId;
    const confirmedUserIds = await listParticipantUserIds({
      transaction: tx,
      serverId,
      gameId,
      status: PARTICIPANT_STATUS.confirmed,
    });
    const due = shouldAutoConfirmAttendance({
      game,
      confirmedCount: confirmedUserIds.length,
      now,
      onlyPastDeadline,
    });
    if (!due) return null;
    await saveAttendance({
      transaction: tx,
      serverId,
      gameId,
      confirmedUserIds,
      absentUserIds: [],
    });
    await tx
      .update(games)
      .set({ attendanceConfirmedAt: attendanceDeadline(game) })
      .where(eq(games.id, gameId));
    return { serverId, gameId, gmId: game.gmId, title: game.title };
  };
  return transaction ? run(transaction) : db.transaction(run);
}

// 매일 크론이 업적 계산보다 먼저 부른다. 모든 서버에서 기한이 지난 미확정 세션을 고른다.
export async function autoConfirmAttendance(now: Date = new Date()): Promise<AutoConfirmedGame[]> {
  const deadline = sql`${games.confirmedAt} + coalesce(${games.playMinutes}, ${DEFAULT_PLAY_MINUTES}) * interval '1 minute' + ${ATTENDANCE_EDIT_DAYS} * interval '1 day'`;
  const candidates = await db
    .select({ id: games.id })
    .from(games)
    .where(
      and(
        isNotNull(games.confirmedAt),
        isNull(games.attendanceConfirmedAt),
        isNull(games.cancelledAt),
        lte(deadline, now),
        exists(
          db
            .select({ one: sql`1` })
            .from(participants)
            .where(
              and(
                eq(participants.gameId, games.id),
                eq(participants.status, PARTICIPANT_STATUS.confirmed),
              ),
            ),
        ),
      ),
    );
  const confirmed: AutoConfirmedGame[] = [];
  for (const { id } of candidates) {
    const result = await autoConfirmAttendanceForGame({ gameId: id, now, onlyPastDeadline: true });
    if (result) confirmed.push(result);
  }
  return confirmed;
}
