import { isNull } from "es-toolkit";

import { isSessionStarted } from "@/entities/game";
import type { Game } from "@/shared/server";

// 서버(updateGame)도 같은 조건으로 저장을 막는다.
export function editLockedTitle(
  game: Pick<Game, "cancelledAt" | "confirmedAt">,
  now: Date = new Date(),
): string | null {
  if (!isNull(game.cancelledAt)) return "취소한 구인은 고칠 수 없습니다";
  if (isSessionStarted(game, now)) return "시작한 세션은 고칠 수 없습니다";
  return null;
}
