import { isNull } from "es-toolkit";

import { isSessionEnded } from "./session-timing";

// 끝난 세션은 기록으로 남아야 해서 취소하지 않는다.
export function cancelBlockReason({
  game,
  now,
}: {
  game: {
    cancelledAt: Date | null;
    confirmedAt: Date | null;
    playMinutes: number | null;
    endedAt: Date | null;
  };
  now: Date;
}): "already_cancelled" | "session_ended" | null {
  if (!isNull(game.cancelledAt)) return "already_cancelled";
  return isSessionEnded(game, now) ? "session_ended" : null;
}
