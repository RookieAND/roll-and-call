import { isNull } from "es-toolkit";

import { isSessionEnded, isSessionStarted } from "./session-timing";

type CancelCheckGame = {
  cancelledAt: Date | null;
  confirmedAt: Date | null;
  playMinutes: number | null;
  endedAt: Date | null;
};

// 시작한 세션은 출석·불참 기록과 어긋나서 자동 취소·운영진 정리는 하지 않는다(D239). GM의 직접 취소(allowStarted)만 종료 전까지 열어 둔다.
export function cancelBlockReason({
  game,
  now,
  allowStarted = false,
}: {
  game: CancelCheckGame;
  now: Date;
  allowStarted?: boolean;
}): "already_cancelled" | "session_started" | "session_ended" | null {
  if (!isNull(game.cancelledAt)) return "already_cancelled";
  if (allowStarted) return isSessionEnded(game, now) ? "session_ended" : null;
  return isSessionStarted(game, now) ? "session_started" : null;
}
