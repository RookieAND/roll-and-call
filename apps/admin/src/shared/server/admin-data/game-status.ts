import type { Game } from "@roll-and-call/database";

import { POST_STATUS, type PostStatus } from "./post-status";

const DEFAULT_PLAY_MINUTES = 240;

// 확정 시각이 지났으면 종료, 확정됐으면 확정, 모집 마감 전이면 모집 중, 마감 뒤 미확정이면 일정 조율 중.
export function gameStatus(game: Game, now: number): PostStatus {
  if (game.confirmedAt) {
    const endsAt = game.confirmedAt.getTime() + (game.playMinutes ?? DEFAULT_PLAY_MINUTES) * 60_000;
    return endsAt <= now ? POST_STATUS.ended : POST_STATUS.confirmed;
  }
  return game.endDate.getTime() > now ? POST_STATUS.recruiting : POST_STATUS.scheduling;
}
