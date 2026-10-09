import { isNil } from "es-toolkit";

import { isSessionEnded } from "@/entities/game";
import type { Game } from "@/shared/server";

type ReopenSource = Pick<
  Game,
  "gmId" | "serverId" | "confirmedAt" | "playMinutes" | "endedAt" | "cancelledAt" | "hiddenAt"
>;

// 내 구인이면서 끝났거나 취소됐을 때만 같은 내용으로 다시 열 수 있다. 숨기거나 제거된 구인은 제외한다.
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
  return !isNil(game.cancelledAt) || isSessionEnded(game, now);
}
