import { isNull } from "es-toolkit";

import { isSessionStarted } from "./session-timing";

// 시작한 세션은 출석·불참 기록과 어긋나서 취소하지 않는다(D239). GM·운영진·자동 취소가 모두 이 판단을 쓴다.
export function cancelBlockReason({
  game,
  now,
}: {
  game: { cancelledAt: Date | null; confirmedAt: Date | null };
  now: Date;
}): "already_cancelled" | "session_started" | null {
  if (!isNull(game.cancelledAt)) return "already_cancelled";
  return isSessionStarted(game, now) ? "session_started" : null;
}
