import { isNull } from "es-toolkit";

import { sessionEndsAt } from "./session-end";

export function isSessionEnded(
  game: Parameters<typeof sessionEndsAt>[0],
  now: Date = new Date(),
): boolean {
  const endsAt = sessionEndsAt(game);
  return !isNull(endsAt) && endsAt.getTime() <= now.getTime();
}
