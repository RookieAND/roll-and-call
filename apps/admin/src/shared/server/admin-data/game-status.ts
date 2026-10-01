import type { Game } from "@roll-and-call/database";

import { POST_STATUS, type PostStatus } from "./post-status";

const DEFAULT_PLAY_MINUTES = 240;

export function gameStatus(game: Game, now: number): PostStatus {
  if (game.confirmedAt) {
    const endsAt = game.confirmedAt.getTime() + (game.playMinutes ?? DEFAULT_PLAY_MINUTES) * 60_000;
    return endsAt <= now ? POST_STATUS.ended : POST_STATUS.confirmed;
  }
  return game.endDate.getTime() > now ? POST_STATUS.recruiting : POST_STATUS.scheduling;
}
