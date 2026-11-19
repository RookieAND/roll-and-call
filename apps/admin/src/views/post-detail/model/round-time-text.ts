import { roundSpanText } from "@roll-and-call/database/notifications/model";

import type { AdminRound } from "./admin-rounds";

// 「10월 24일 (토) 오후 12:00~4:00」. 일시가 없으면 null이다.
export function roundTimeText(round: AdminRound) {
  if (!round.startAt || !round.plannedEndAt) return null;
  return roundSpanText({
    startsAt: round.startAt.toISOString(),
    endsAt: round.plannedEndAt.toISOString(),
  });
}
