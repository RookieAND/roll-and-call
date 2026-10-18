import { isNull } from "es-toolkit";

import { isSessionEnded } from "./session-timing";

export const GAME_POST_PHASE = {
  recruiting: "recruiting",
  scheduling: "scheduling",
  confirmed: "confirmed",
  ended: "ended",
  cancelled: "cancelled",
} as const;
export type GamePostPhase = (typeof GAME_POST_PHASE)[keyof typeof GAME_POST_PHASE];

interface PhaseGame {
  cancelledAt: Date | null;
  confirmedAt: Date | null;
  endDate: Date;
  playMinutes: number | null;
  endedAt: Date | null;
}

// 구인글의 진행 단계. 인원이 아니라 일정(확정·종료)과 모집 기한만 본다(deriveGameStatus는 정원·대기까지 본다).
export function gamePostPhase(game: PhaseGame, now: number): GamePostPhase {
  if (!isNull(game.cancelledAt)) return GAME_POST_PHASE.cancelled;
  if (game.confirmedAt) {
    return isSessionEnded(game, new Date(now)) ? GAME_POST_PHASE.ended : GAME_POST_PHASE.confirmed;
  }
  return game.endDate.getTime() > now ? GAME_POST_PHASE.recruiting : GAME_POST_PHASE.scheduling;
}
