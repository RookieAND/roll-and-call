import { and, eq, exists, inArray, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "#/client";
import {
  ATTENDANCE_EDIT_HOURS,
  attendanceDeadline,
} from "#/modules/games/model/attendance-deadline";
import { autoConfirmNotices } from "#/modules/games/model/auto-confirm-notices";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { shouldAutoConfirmAttendance } from "#/modules/games/model/should-auto-confirm-attendance";
import { listParticipantUserIds } from "#/modules/games/queries/list-participant-user-ids";
import { sessionEndAtSql } from "#/modules/games/queries/session-end-at-sql";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants } from "#/schema";

import { markAttendanceConfirmed } from "./mark-attendance-confirmed";

export type AutoConfirmedGame = { serverId: string; gameId: string; gmId: string; title: string };

// 출석 결과는 그대로 두고 확정 시각만 기한 시각으로 남긴다. 그래서 자동 확정인지 나중에 가릴 수 있다.
// onlyPastDeadline이 false면(GM이 서버를 나간 진행 중 세션) 기한을 기다리지 않는다.
// 알림은 같은 트랜잭션에서 넣는다. 크론이 다시 돌아도 처음 확정 시각이 있는 구인은 고르지 않는다.
// notifyGm이 false면(서버를 나간 GM) 자동 확정 알림을 남기지 않고 참석자 후기 알림만 보낸다.
export async function autoConfirmAttendanceForGame({
  transaction,
  gameId,
  now = new Date(),
  onlyPastDeadline = false,
  notifyGm = true,
}: {
  transaction?: Transaction;
  gameId: string;
  now?: Date;
  onlyPastDeadline?: boolean;
  notifyGm?: boolean;
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
    const rows = await tx
      .select({
        userId: participants.userId,
        status: participants.status,
        absent: participants.absent,
        absenceCancelledAt: participants.absenceCancelledAt,
      })
      .from(participants)
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          inArray(participants.status, [PARTICIPANT_STATUS.confirmed, PARTICIPANT_STATUS.removed]),
        ),
      );
    await createNotifications({
      executor: tx,
      serverId,
      actorId: null,
      notifications: autoConfirmNotices({
        game: { id: gameId, title: game.title, gmId: game.gmId },
        rows,
        notifyGm,
      }),
    });
    return { serverId, gameId, gmId: game.gmId, title: game.title };
  };
  return transaction ? run(transaction) : db.transaction(run);
}

// 매시 5분 크론(/api/cron/attendance)이 부른다. 모든 서버에서 기한이 지난 미확정 세션을 고른다.
export async function autoConfirmAttendance(now: Date = new Date()): Promise<AutoConfirmedGame[]> {
  const deadline = sql`${sessionEndAtSql} + ${ATTENDANCE_EDIT_HOURS} * interval '1 hour'`;
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
