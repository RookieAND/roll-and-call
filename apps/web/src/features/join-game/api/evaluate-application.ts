import "server-only";
import type { Game } from "@roll-and-call/database";
import { loadParticipationStanding } from "@roll-and-call/database/badges";
import {
  countParticipants,
  findScheduleConflicts,
  listDatedRounds,
  lockGame,
} from "@roll-and-call/database/games";
import { findActiveSanction } from "@roll-and-call/database/moderation";
import type { Transaction } from "@roll-and-call/database/transaction";

import {
  DIE_FACES,
  GAME_VISIBILITY,
  isApplicationClosed,
  participationConditions,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SELECTION_APPLICANT_LIMIT,
} from "@/entities/game";
import {
  APPLICATION_CLOSED_MESSAGE,
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_RESULT,
  HIDDEN_GAME_APPLY_MESSAGE,
  PRIVATE_GAME_APPLY_MESSAGE,
  SELECTION_FINISHED_APPLY_MESSAGE,
  SELECTION_TOO_MANY_MESSAGE,
  SANCTIONED_APPLY_MESSAGE,
  type ActionResult,
} from "@/shared/api";

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
  if (game.visibility === GAME_VISIBILITY.private) return { error: PRIVATE_GAME_APPLY_MESSAGE };
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

  if (game.minRulePlays !== null || game.requireRulebookCert) {
    const standing = await loadParticipationStanding({
      transaction,
      serverId,
      userId,
      rule: game.rule,
      rulebookId: game.rulebookId,
    });
    const unmet = participationConditions({ game, standing }).find((condition) => !condition.met);
    if (unmet) return { error: unmet.unmetLine };
  }

  // 일시가 정해진 회차는 모두 내 다른 세션과 비교한다. 일정 조율 중인 구인은 정해진 회차가 없어 건너뛴다.
  // 같은 사람의 신청끼리 줄을 세워 동시 신청도 막는다.
  const target = await listDatedRounds({ transaction, gameId });
  if (target.length > 0) {
    const [conflict] = await findScheduleConflicts({
      transaction,
      serverId,
      gameId,
      people: [{ userId, role: "confirmed" }],
      target,
    });
    const overlapping = conflict?.overlaps[0];
    if (overlapping) {
      return { error: OVERLAP_MESSAGE, reason: OVERLAP_REASON, overlapGameId: overlapping.gameId };
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
