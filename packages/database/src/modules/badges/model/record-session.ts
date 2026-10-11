import { isNil } from "es-toolkit";

import { isSessionEnded } from "#/modules/games/model/session-timing";

type Moment = Date | string | null;

export type RecordGame = {
  id: string;
  gmId: string;
  confirmedAt: Moment;
  playMinutes: number | null;
  endedAt: Moment;
  hiddenAt: Moment;
  cancelledAt: Moment;
  // 포인트제에서 미니룰 점수로 센다: 룰북이 없거나 미니룰 분류의 룰북(miniRuleOf). 참여 횟수제에서는 보지 않는다.
  miniRule?: boolean;
  participants: {
    userId: string;
    status: string;
    absent: boolean;
    absenceCancelledAt: Moment;
  }[];
};

// 이 달의 기록·프로필 세션 수가 세는 세션. 업적의 isRecognizedSession과 달리 출석 확인 전에도 센다(홈 R5, 프로필 R12).
export function isRecordSession(
  game: Omit<RecordGame, "participants"> & { confirmedCount: number },
  now: Date,
): boolean {
  if (isNil(game.confirmedAt) || !isNil(game.hiddenAt) || !isNil(game.cancelledAt)) return false;
  return game.confirmedCount > 0 && isSessionEnded(game, now);
}
