import type { Game } from "@roll-and-call/database";
import { isNil } from "es-toolkit";

import { isSessionEnded } from "@/entities/game";

type ReopenSource = Pick<
  Game,
  "gmId" | "serverId" | "confirmedAt" | "playMinutes" | "endedAt" | "cancelledAt" | "hiddenAt"
> &
  Partial<Pick<Game, "roundCount" | "finishedAt">>;

// 내 구인이면서 끝났거나 취소됐을 때만 같은 내용으로 다시 열 수 있다. 다회차는 모든 회차가 끝나 구인이 마쳐졌을 때만 끝난 것으로 본다. 숨기거나 제거된 구인은 제외한다.
export function canReopenGame({
  game,
  userId,
  serverId,
  now = new Date(),
}: {
  game: ReopenSource;
  userId: string;
  serverId: string;
  now?: Date;
}): boolean {
  if (game.gmId !== userId || game.serverId !== serverId) return false;
  if (!isNil(game.hiddenAt)) return false;
  if (!isNil(game.cancelledAt)) return true;
  if ((game.roundCount ?? 1) > 1) return !isNil(game.finishedAt) && game.finishedAt <= now;
  return isSessionEnded(game, now);
}
