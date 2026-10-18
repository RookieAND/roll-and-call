import { GAME_POST_PHASE, gamePostPhase } from "@roll-and-call/database/games/model";

import { POST_STATUS, type PostStatus } from "./post-status";

const POST_STATUS_BY_PHASE = {
  [GAME_POST_PHASE.recruiting]: POST_STATUS.recruiting,
  [GAME_POST_PHASE.scheduling]: POST_STATUS.scheduling,
  [GAME_POST_PHASE.confirmed]: POST_STATUS.confirmed,
  [GAME_POST_PHASE.ended]: POST_STATUS.ended,
  [GAME_POST_PHASE.cancelled]: POST_STATUS.cancelled,
} as const satisfies Record<string, PostStatus>;

export function gameStatus(game: Parameters<typeof gamePostPhase>[0], now: number): PostStatus {
  return POST_STATUS_BY_PHASE[gamePostPhase(game, now)];
}
