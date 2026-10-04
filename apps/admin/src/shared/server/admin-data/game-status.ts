import type { Game } from "@roll-and-call/database";
import { isSessionEnded } from "@roll-and-call/database/games/model";

import { POST_STATUS, type PostStatus } from "./post-status";

export function gameStatus(game: Game, now: number): PostStatus {
  if (game.confirmedAt) {
    return isSessionEnded(game, new Date(now)) ? POST_STATUS.ended : POST_STATUS.confirmed;
  }
  return game.endDate.getTime() > now ? POST_STATUS.recruiting : POST_STATUS.scheduling;
}
