import { isSessionEnded } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";

export const WAITING_LEAVE_BLOCK = {
  closed: "closed",
  ended: "ended",
} as const;
export type WaitingLeaveBlock = (typeof WAITING_LEAVE_BLOCK)[keyof typeof WAITING_LEAVE_BLOCK];

// 추첨 신청자는 모집 마감 전까지(D245), 선착순 대기자와 추첨 결과 대기자는 세션이 끝날 때까지(D264) 취소한다.
export function waitingLeaveBlock({
  game,
  now = new Date(),
}: {
  game: {
    recruitMethod: RecruitMethod;
    drawnAt: Date | null;
    endDate: Date;
    confirmedAt: Date | null;
    playMinutes: number | null;
    endedAt: Date | null;
  };
  now?: Date;
}): WaitingLeaveBlock | null {
  const isLotteryApplicant = game.recruitMethod === RECRUIT_METHOD.lottery && isNil(game.drawnAt);
  if (isLotteryApplicant) {
    return game.endDate.getTime() <= now.getTime() ? WAITING_LEAVE_BLOCK.closed : null;
  }
  return isSessionEnded(game, now) ? WAITING_LEAVE_BLOCK.ended : null;
}
