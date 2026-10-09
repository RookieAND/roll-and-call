import { closeGameRecruitment } from "#/modules/games/commands/close-game-recruitment";
import { markSelectionFinished } from "#/modules/games/commands/mark-selection-finished";
import { finishSelectionBlock } from "#/modules/games/model/can-finish-selection";
import { compareWaitlistOrder } from "#/modules/games/model/compare-waitlist-order";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { SCHEDULE_MODE } from "#/modules/games/model/schedule-mode";
import {
  SELECTION_REJECTION,
  type SelectionRejection,
} from "#/modules/games/model/selection-rejection";
import { isApplicationClosed } from "#/modules/games/model/session-timing";
import { listParticipantUserIds } from "#/modules/games/queries/list-participant-user-ids";
import { listWaitingParticipants } from "#/modules/games/queries/list-waiting-participants";
import { lockGame } from "#/modules/games/queries/lock-game";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import type { Transaction } from "#/modules/transaction/transaction";
import type { Game } from "#/schema";

export type FinishSelectionResult =
  | {
      kind: "finished";
      game: Game;
      confirmedUserIds: string[];
      waitingUserIds: string[];
      becameFull: boolean;
    }
  | { kind: "rejected"; reason: SelectionRejection; minPlayers: number | null };

const reject = (
  reason: SelectionRejection,
  minPlayers: number | null = null,
): FinishSelectionResult => ({
  kind: "rejected",
  reason,
  minPlayers,
});

// GM의 [선발 마치기]. 게임 행 잠금 뒤 selectionFinishedAt을 다시 보므로 동시에 눌러도 한 번만 적용된다.
// 마감 전이면 모집을 지금 마감하고, 남은 신청자는 행을 바꾸지 않은 채 대기 번호(신청 시각 순)만 알린다.
export async function finishSelection({
  transaction,
  serverId,
  gameId,
  actorId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  actorId: string;
  now: Date;
}): Promise<FinishSelectionResult> {
  const game = await lockGame({ transaction, serverId, gameId });
  if (!game) return reject(SELECTION_REJECTION.notFound);
  if (game.gmId !== actorId) return reject(SELECTION_REJECTION.notGm);
  if (game.cancelledAt) return reject(SELECTION_REJECTION.cancelled);
  if (game.recruitMethod !== RECRUIT_METHOD.selection) {
    return reject(SELECTION_REJECTION.notSelection);
  }
  if (game.selectionFinishedAt) return reject(SELECTION_REJECTION.alreadyFinished);
  if (isApplicationClosed(game, now)) return reject(SELECTION_REJECTION.applicationClosed);

  const confirmedUserIds = await listParticipantUserIds({
    transaction,
    serverId,
    gameId,
    status: PARTICIPANT_STATUS.confirmed,
  });
  const waiting = await listWaitingParticipants({ transaction, serverId, gameId });
  const block = finishSelectionBlock({
    minPlayers: game.minPlayers,
    confirmedCount: confirmedUserIds.length,
    applicantCount: waiting.length,
  });
  if (block) return reject(block, game.minPlayers);

  if (game.endDate > now) {
    await closeGameRecruitment({ transaction, serverId, gameId, endDate: now });
  }
  await markSelectionFinished({ transaction, serverId, gameId, at: now });

  const waitingUserIds = waiting.toSorted(compareWaitlistOrder).map((row) => row.userId);
  const gameParams = { gameId, gameTitle: game.title };
  await createNotifications({
    executor: transaction,
    serverId,
    actorId,
    notifications: [
      ...confirmedUserIds.map((userId) => ({
        userId,
        ...confirmedNotification({ game, gameParams }),
      })),
      ...waitingUserIds.map((userId, index) => ({
        userId,
        kind: NOTIFICATION_KIND.selectionWaitlisted,
        params: { ...gameParams, waitlistRank: index + 1 },
      })),
    ],
  });

  return {
    kind: "finished",
    game: { ...game, selectionFinishedAt: now, minPlayersJudgedAt: now },
    confirmedUserIds,
    waitingUserIds,
    becameFull: confirmedUserIds.length === game.maxPlayers,
  };
}

function confirmedNotification({
  game,
  gameParams,
}: {
  game: Game;
  gameParams: { gameId: string; gameTitle: string };
}) {
  if (game.scheduleMode === SCHEDULE_MODE.fixed && game.confirmedAt) {
    return {
      kind: NOTIFICATION_KIND.selectionScheduleConfirmed,
      params: { ...gameParams, startsAt: game.confirmedAt.toISOString() },
    } as const;
  }
  return { kind: NOTIFICATION_KIND.selectionParticipationConfirmed, params: gameParams } as const;
}
