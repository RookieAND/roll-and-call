import { and, eq, exists, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  ATTENDANCE_EDIT_DAYS,
  attendanceDeadline,
} from "#/modules/games/model/attendance-deadline";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { shouldAutoConfirmAttendance } from "#/modules/games/model/should-auto-confirm-attendance";
import { listParticipantUserIds } from "#/modules/games/queries/list-participant-user-ids";
import { sessionEndAtSql } from "#/modules/games/queries/session-end-at-sql";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants } from "#/schema";

import { markAttendanceConfirmed } from "./mark-attendance-confirmed";

export type AutoConfirmedGame = { serverId: string; gameId: string; gmId: string; title: string };

// 출석 결과는 그대로 두고 확정 시각만 기한 시각으로 남긴다. 그래서 자동 확정인지 나중에 가릴 수 있다.
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
    await markAttendanceConfirmed({
      transaction: tx,
      serverId,
      gameId,
      at: attendanceDeadline(game)!,
    });
    return { serverId, gameId, gmId: game.gmId, title: game.title };
  };
  return transaction ? run(transaction) : db.transaction(run);
}

// 매일 크론이 업적 계산보다 먼저 부른다. 모든 서버에서 기한이 지난 미확정 세션을 고른다.
export async function autoConfirmAttendance(now: Date = new Date()): Promise<AutoConfirmedGame[]> {
  const deadline = sql`${sessionEndAtSql} + ${ATTENDANCE_EDIT_DAYS} * interval '1 day'`;
  const candidates = await db
    .select({ id: games.id })
    .from(games)
    .where(
      and(
        isNotNull(games.confirmedAt),
        isNull(games.attendanceConfirmedAt),
        isNull(games.attendanceFirstConfirmedAt),
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
