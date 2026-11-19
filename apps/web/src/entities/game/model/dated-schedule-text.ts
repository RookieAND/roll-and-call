import { formatDateWeekday } from "@/shared/lib";

import { roundClockLabel } from "./round-clock-label";
import { roundTotalLabel } from "./round-total-label";

// 「10월 24일 (토) 오후 12:00부터 · 총 6회」
export function datedScheduleText({
  startsAt,
  roundCount,
}: {
  startsAt: Date;
  roundCount: number;
}) {
  return `${formatDateWeekday(startsAt)} ${roundClockLabel(startsAt)}부터 · ${roundTotalLabel(roundCount)}`;
}
