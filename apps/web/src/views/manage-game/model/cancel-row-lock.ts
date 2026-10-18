import type { GameDetailData } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

import { isSessionEnded } from "@/entities/game";

import { CANCELLED_ROW_DETAIL } from "./manage-rows";

export function cancelRowLock({
  game,
  now = new Date(),
}: {
  game: GameDetailData;
  now?: Date;
}): string | undefined {
  if (!isNil(game.cancelledAt)) return CANCELLED_ROW_DETAIL;
  if (isSessionEnded(game, now)) return "끝난 세션은 취소할 수 없습니다";
  return undefined;
}
