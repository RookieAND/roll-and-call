import { and, eq, inArray, isNull, or } from "drizzle-orm";

import { departedGmGameAction } from "#/modules/games/model/departed-gm-game-action";
import type { GameCancelKind } from "#/modules/games/model/game-cancel-kind";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { isSessionInProgress } from "#/modules/games/model/session-timing";
import { listSeatOpenedRecipients } from "#/modules/games/queries/list-seat-opened-recipients";
import { notStartedGamesWhere } from "#/modules/games/queries/not-started-games-where";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants, staff, type Game } from "#/schema";

import { autoConfirmAttendanceForGame } from "./auto-confirm-attendance";
import { cancelGame } from "./cancel-game";
import { setSessionEndedAt } from "./end-session";

export type ReleasedMemberGames = {
  leftGameIds: string[];
  leftConfirmedGameIds: string[];
  cancelledGames: Game[];
  autoConfirmedGameIds: string[];
};

// 서버를 떠난 사람(추방·탈퇴)의 정리. 운영진 역할을 떼고(소유자는 그대로), 시작 전 구인의 신청·대기·확정에서 빼고,
// GM인 시작 전 구인은 취소하고, GM인 시작한 세션은 진행 중이면 나간 시각에 마치고, 출석 결과는 그대로 둔 채 확정한다. 끝난 세션·후기·불참 기록은 그대로다.
export async function releaseMemberGames({
  transaction,
  serverId,
  userId,
  cancelKind,
  actorId,
}: {
  transaction: Transaction;
  serverId: string;
  userId: string;
  cancelKind: GameCancelKind;
  actorId: string | null;
}): Promise<ReleasedMemberGames> {
  // 소유자 역할은 남는다. 소유권 이전은 따로 한다.
  await transaction
    .delete(staff)
    .where(and(eq(staff.serverId, serverId), eq(staff.userId, userId), eq(staff.role, "staff")));

  const notStarted = transaction
    .select({ id: games.id })
    .from(games)
    .where(notStartedGamesWhere(serverId));
  const left = await transaction
    .delete(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.userId, userId),
        inArray(participants.gameId, notStarted),
      ),
    )
    .returning({ gameId: participants.gameId, status: participants.status });

  // 끝나고 출석까지 확정한 세션은 읽지 않는다.
  const hosted = await transaction
    .select({
      id: games.id,
      confirmedAt: games.confirmedAt,
      playMinutes: games.playMinutes,
      endedAt: games.endedAt,
      attendanceConfirmedAt: games.attendanceConfirmedAt,
      cancelledAt: games.cancelledAt,
    })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.gmId, userId),
        isNull(games.cancelledAt),
        or(isNull(games.attendanceConfirmedAt), isNull(games.confirmedAt)),
      ),
    );
  const now = new Date();
  const cancelledGames: Game[] = [];
  const autoConfirmedGameIds: string[] = [];
  for (const game of hosted) {
    const action = departedGmGameAction({ game, now });
    if (action === "cancel") {
      const cancelled = await cancelGame({
        transaction,
        serverId,
        gameId: game.id,
        kind: cancelKind,
        actorId,
        reason: null,
        now,
      });
      if (cancelled.ok) cancelledGames.push(cancelled.game);
    }
    if (action === "confirm_attendance") {
      // 이미 끝난 세션은 ended_at을 그대로 둔다. 자동 확정 시각은 기한(마친 시각 + 24시간, 미래)이라
      // isAutoConfirmedAttendance가 이 확정을 자동 확정으로 본다.
      if (isSessionInProgress(game, now)) {
        await setSessionEndedAt({ transaction, serverId, gameId: game.id, endedAt: now });
      }
      const confirmed = await autoConfirmAttendanceForGame({
        transaction,
        gameId: game.id,
        now,
        notifyGm: false,
      });
      if (confirmed) autoConfirmedGameIds.push(game.id);
    }
  }

  const leftConfirmedGameIds = left
    .filter((row) => row.status === PARTICIPANT_STATUS.confirmed)
    .map((row) => row.gameId);
  // 비운 확정 자리마다 대기자에게 빈자리 알림을 보낸다. 취소된 구인은 listSeatOpenedRecipients가 거른다.
  const seatOpenedGames =
    leftConfirmedGameIds.length === 0
      ? []
      : await transaction
          .select()
          .from(games)
          .where(and(eq(games.serverId, serverId), inArray(games.id, leftConfirmedGameIds)));
  for (const game of seatOpenedGames) {
    const recipients = await listSeatOpenedRecipients({
      transaction,
      serverId,
      gameId: game.id,
      game,
      now,
    });
    await createNotifications({
      executor: transaction,
      serverId,
      actorId,
      notifications: recipients.map((recipientId) => ({
        userId: recipientId,
        kind: NOTIFICATION_KIND.seatOpened,
        params: { gameId: game.id, gameTitle: game.title },
      })),
    });
  }

  return {
    leftGameIds: left.map((row) => row.gameId),
    leftConfirmedGameIds,
    cancelledGames,
    autoConfirmedGameIds,
  };
}
