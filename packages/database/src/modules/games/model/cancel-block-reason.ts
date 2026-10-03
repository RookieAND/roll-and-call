import { isNull } from "es-toolkit";

import { sessionEndsAt } from "./session-ends-at";

// 끝난 세션은 기록으로 남아야 해서 취소하지 않는다.
export function cancelBlockReason({
  game,
  now,
}: {
  game: { cancelledAt: Date | null; confirmedAt: Date | null; playMinutes: number | null };
  now: Date;
}): "already_cancelled" | "session_ended" | null {
  if (!isNull(game.cancelledAt)) return "already_cancelled";
  if (isNull(game.confirmedAt)) return null;
  const endsAt = sessionEndsAt({ startsAt: game.confirmedAt, playMinutes: game.playMinutes });
  return endsAt.getTime() <= now.getTime() ? "session_ended" : null;
}
