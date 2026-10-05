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
  // 룰북을 연결하지 않은 구인은 미니룰이 아니다.
  rulebook?: { miniRule: boolean } | null;
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
