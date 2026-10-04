import { randomInt } from "node:crypto";

import { isNull } from "es-toolkit";

import { closeGameRecruitment } from "#/modules/games/commands/close-game-recruitment";
import { markGameDrawn } from "#/modules/games/commands/mark-game-drawn";
import { saveDrawResults } from "#/modules/games/commands/save-draw-results";
import { setDrawRank } from "#/modules/games/commands/set-draw-rank";
import { compareWaitlistOrder } from "#/modules/games/model/compare-waitlist-order";
import { DIE_FACES } from "#/modules/games/model/die-faces";
import { DRAW_REJECTION, type DrawRejection } from "#/modules/games/model/draw-rejection";
import { DRAW_RESULT_KIND } from "#/modules/games/model/draw-result-kind";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { planLotteryDraw } from "#/modules/games/model/plan-lottery-draw";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { rollDistinct } from "#/modules/games/model/roll-distinct";
import { isApplicationClosed } from "#/modules/games/model/session-timing";
import { countRolledParticipants } from "#/modules/games/queries/count-rolled-participants";
import { listParticipantUserIds } from "#/modules/games/queries/list-participant-user-ids";
import { listWaitingParticipants } from "#/modules/games/queries/list-waiting-participants";
import { lockGame } from "#/modules/games/queries/lock-game";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import type { Transaction } from "#/modules/transaction/transaction";

export type DrawLotteryResult =
  | {
      kind: typeof DRAW_RESULT_KIND.drawn;
      confirmedUserIds: string[];
      waitingUserIds: string[];
      preConfirmedUserIds: string[];
      becameFull: boolean;
    }
  | { kind: typeof DRAW_RESULT_KIND.empty }
  | { kind: typeof DRAW_RESULT_KIND.rejected; reason: DrawRejection };

const reject = (reason: DrawRejection): DrawLotteryResult => ({
  kind: DRAW_RESULT_KIND.rejected,
  reason,
});

// 추첨은 굴림·확정·대기·알림을 한 트랜잭션에서 끝낸다(R10). GM 버튼과 마감 크론이 같은 명령을 부르고,
// 게임 행 잠금 뒤 drawn_at을 다시 보므로 먼저 끝난 쪽 하나만 적용된다(D250). actorId가 null이면 크론이다.
export async function drawLottery({
  transaction,
  serverId,
  gameId,
  actorId,
  now,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  actorId: string | null;
  now: Date;
}): Promise<DrawLotteryResult> {
  const game = await lockGame({ transaction, serverId, gameId });
  if (!game) return reject(DRAW_REJECTION.notFound);
  if (!isNull(actorId) && game.gmId !== actorId) return reject(DRAW_REJECTION.notGm);
  if (game.cancelledAt) return reject(DRAW_REJECTION.cancelled);
  if (game.recruitMethod !== RECRUIT_METHOD.lottery) return reject(DRAW_REJECTION.notLottery);
  const rolledCount = await countRolledParticipants({ transaction, serverId, gameId });
  if (game.drawnAt || rolledCount > 0) return reject(DRAW_REJECTION.alreadyDrawn);
  if (isApplicationClosed(game, now)) return reject(DRAW_REJECTION.applicationClosed);

  const applicantIds = await listParticipantUserIds({
    transaction,
    serverId,
    gameId,
    status: PARTICIPANT_STATUS.waiting,
  });
  if (applicantIds.length === 0 && !isNull(actorId)) return reject(DRAW_REJECTION.noApplicants);
  if (applicantIds.length > DIE_FACES) return reject(DRAW_REJECTION.tooMany);

  const preConfirmedUserIds = await listParticipantUserIds({
    transaction,
    serverId,
    gameId,
    status: PARTICIPANT_STATUS.confirmed,
  });
  if (game.endDate > now) {
    await closeGameRecruitment({ transaction, serverId, gameId, endDate: now });
  }
  await markGameDrawn({ transaction, serverId, gameId, at: now });
  const gameParams = { gameId, gameTitle: game.title };

  if (applicantIds.length === 0) {
    await saveDrawResults({ transaction, serverId, gameId });
    await createNotifications({
      executor: transaction,
      serverId,
      actorId,
      notifications: [
        { userId: game.gmId, kind: NOTIFICATION_KIND.recruitmentClosedEmpty, params: gameParams },
      ],
    });
    return { kind: DRAW_RESULT_KIND.empty };
  }

  const rolls = rollDistinct({
    count: applicantIds.length,
    roll: () => randomInt(1, DIE_FACES + 1),
  });
  const plan = planLotteryDraw({
    applicants: applicantIds.map((userId, index) => ({ userId, roll: rolls[index]! })),
    confirmedCount: preConfirmedUserIds.length,
    maxPlayers: game.maxPlayers,
  });
  const outcomes = [
    ...plan.confirmed.map((entry) => ({ ...entry, status: PARTICIPANT_STATUS.confirmed })),
    ...plan.waiting.map((entry) => ({ ...entry, status: PARTICIPANT_STATUS.waiting })),
  ];
  for (const outcome of outcomes) {
    await setDrawRank({
      transaction,
      serverId,
      gameId,
      userId: outcome.userId,
      drawRoll: outcome.roll,
      drawRank: outcome.rank,
      status: outcome.status,
      at: now,
    });
  }
  await saveDrawResults({ transaction, serverId, gameId });

  const waiting = await listWaitingParticipants({ transaction, serverId, gameId });
  const waitingUserIds = waiting.toSorted(compareWaitlistOrder).map((row) => row.userId);
  const confirmedUserIds = plan.confirmed.map((entry) => entry.userId);
  await createNotifications({
    executor: transaction,
    serverId,
    actorId,
    notifications: [
      ...confirmedUserIds.map((userId) => ({
        userId,
        kind: NOTIFICATION_KIND.drawWon,
        params: gameParams,
      })),
      ...waitingUserIds.map((userId, index) => ({
        userId,
        kind: NOTIFICATION_KIND.drawWaitlisted,
        params: { ...gameParams, waitlistRank: index + 1 },
      })),
    ],
  });

  const confirmedAfter = preConfirmedUserIds.length + confirmedUserIds.length;
  return {
    kind: DRAW_RESULT_KIND.drawn,
    confirmedUserIds,
    waitingUserIds,
    preConfirmedUserIds,
    becameFull: confirmedUserIds.length > 0 && confirmedAfter === game.maxPlayers,
  };
}
