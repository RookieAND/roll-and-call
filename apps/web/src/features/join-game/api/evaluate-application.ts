import "server-only";
import {
  countParticipants,
  listUserSessionTimings,
  lockGame,
  lockUserApplications,
} from "@roll-and-call/database/games";
import type { Transaction } from "@roll-and-call/database/transaction";

import {
  DIE_FACES,
  isApplicationClosed,
  findOverlappingGame,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  SELECTION_APPLICANT_LIMIT,
} from "@/entities/game";
import {
  APPLICATION_CLOSED_MESSAGE,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_RESULT,
  HIDDEN_GAME_APPLY_MESSAGE,
  SELECTION_FINISHED_APPLY_MESSAGE,
  SELECTION_TOO_MANY_MESSAGE,
  SANCTIONED_APPLY_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { findActiveSanction, type Game } from "@/shared/server";

import { OVERLAP_MESSAGE, OVERLAP_REASON, type OverlapRejection } from "../model/overlap-rejection";

export type Rejection = (ActionResult & { error: string }) | OverlapRejection;

export type Evaluation = {
  game: Game;
  status: typeof PARTICIPANT_STATUS.confirmed | typeof PARTICIPANT_STATUS.waiting;
  confirmedCount: number;
};

// 신청을 받을 수 있는지 막힘 검사를 순서대로 거친다. 저장은 하지 않는다. 호출하는 쪽이 구인 행을 잠근 트랜잭션을 넘긴다.
export async function evaluateApplication({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}): Promise<Evaluation | Rejection> {
  const game = await lockGame({ transaction, serverId, gameId });

  if (!game) return GAME_NOT_FOUND_RESULT;
  if (game.cancelledAt) return { error: GAME_CANCELLED_MESSAGE };
  if (game.gmId === userId) {
    return { error: "GM은 참여자로 참여할 수 없습니다." };
  }
  if (game.selectionFinishedAt) return { error: SELECTION_FINISHED_APPLY_MESSAGE };
  if (game.hiddenAt) return { error: HIDDEN_GAME_APPLY_MESSAGE };
  if (await findActiveSanction({ executor: transaction, serverId, userId })) {
    return { error: SANCTIONED_APPLY_MESSAGE };
  }
  // 일시 지정형은 등록 때부터 confirmedAt이 있으므로, 신청 닫힘은 isApplicationClosed로 본다.
  if (isApplicationClosed(game)) return { error: APPLICATION_CLOSED_MESSAGE };
  if (game.endDate.getTime() <= Date.now()) {
    return { error: "모집이 마감되었습니다." };
  }

  // 일정 조율형은 신청 때 일시가 없어 겹침을 보지 않는다. 같은 사람의 신청끼리 줄을 세워 동시 신청도 막는다.
  if (game.scheduleMode === SCHEDULE_MODE.fixed && game.confirmedAt) {
    await lockUserApplications({ transaction, userId });
    const [overlapping] = findOverlappingGame({
      target: { startsAt: game.confirmedAt, playMinutes: game.playMinutes },
      mine: await listUserSessionTimings({
        transaction,
        serverId,
        userId,
        excludeGameId: gameId,
      }),
    });
    if (overlapping) {
      return { error: OVERLAP_MESSAGE, reason: OVERLAP_REASON, overlapGameId: overlapping.id };
    }
  }

  const confirmedCount = await countParticipants({
    transaction,
    serverId,
    gameId,
    status: PARTICIPANT_STATUS.confirmed,
  });
  // 추첨·선발은 정원과 무관하게 받고, GM이 참여자 관리에서 확정 인원을 정한다.
  const isFirstCome = game.recruitMethod === RECRUIT_METHOD.firstCome;
  const isLottery = game.recruitMethod === RECRUIT_METHOD.lottery;
  const isConfirmed = isFirstCome && confirmedCount < game.maxPlayers;
  if (isFirstCome && !isConfirmed && !game.waitlistEnabled) {
    return { error: "정원이 가득 차 신청할 수 없습니다." };
  }
  if (!isFirstCome) {
    const applicantCount = await countParticipants({
      transaction,
      serverId,
      gameId,
      status: PARTICIPANT_STATUS.waiting,
    });
    // 1d100 값이 사람마다 달라야 해서 면 수를 넘겨 받지 않는다.
    if (isLottery && applicantCount >= DIE_FACES) {
      return { error: `추첨 신청은 ${DIE_FACES}명까지만 받을 수 있습니다.` };
    }
    if (!isLottery && applicantCount >= SELECTION_APPLICANT_LIMIT) {
      return { error: SELECTION_TOO_MANY_MESSAGE };
    }
  }
  const status = isConfirmed ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting;
  return { game, status, confirmedCount };
}
