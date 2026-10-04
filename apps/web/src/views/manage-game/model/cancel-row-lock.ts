import { isNil } from "es-toolkit";

import { isSessionStarted } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { CANCELLED_ROW_DETAIL } from "./manage-rows";

export function cancelRowLock({
  game,
  now = new Date(),
}: {
  game: GameDetailData;
  now?: Date;
}): string | undefined {
  if (!isNil(game.cancelledAt)) return CANCELLED_ROW_DETAIL;
  if (isSessionStarted(game, now)) return "시작한 세션은 취소할 수 없습니다";
  return undefined;
}
