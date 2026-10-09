import { AWAITING_RESULT_PHRASE, awaitingResultMethod } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import {
  isGameGm,
  PARTICIPANT_STATUS,
  SCHEDULE_MODE,
  type ParticipantStatus,
  type RecruitMethod,
  type ScheduleMode,
} from "@/entities/game";
import { APPLICATION_CLOSED_MESSAGE, GAME_CANCELLED_MESSAGE } from "@/shared/api";

// 가능 시간을 칠할 수 없는 이유. 칠할 수 있으면 null. 칠하는 사람은 GM과 확정 참여자뿐이다(R2).
export function availabilityBlockReason({
  game,
  participants,
  userId,
}: {
  game: {
    scheduleMode: ScheduleMode;
    confirmedAt: Date | null;
    cancelledAt: Date | null;
    recruitMethod: RecruitMethod;
    drawnAt: Date | null;
    selectionFinishedAt: Date | null;
    gmId: string;
  };
  participants: { userId: string; status: ParticipantStatus }[];
  userId: string | null;
}): string | null {
  if (!isNil(game.cancelledAt)) return GAME_CANCELLED_MESSAGE;
  if (game.scheduleMode !== SCHEDULE_MODE.coordinate) {
    return "일시가 지정된 구인은 조율 대상이 아닙니다.";
  }
  if (!isNil(game.confirmedAt)) return APPLICATION_CLOSED_MESSAGE;
  const awaiting = awaitingResultMethod(game);
  if (awaiting) return `${AWAITING_RESULT_PHRASE[awaiting]} 가능 시간을 낼 수 있습니다.`;
  const confirmed = participants.some(
    (participant) =>
      participant.userId === userId && participant.status === PARTICIPANT_STATUS.confirmed,
  );
  if (!confirmed && !isGameGm({ gmId: game.gmId, userId })) {
    return "참여자만 가능 시간을 등록할 수 있습니다.";
  }
  return null;
}
