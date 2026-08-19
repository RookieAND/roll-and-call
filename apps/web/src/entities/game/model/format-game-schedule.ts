import type { Game } from "@/shared/api/db";
import { formatDate, formatDateTime } from "@/shared/lib/format";
import { SCHEDULE_MODE } from "./schedule-mode";

// 세션 일정 한 줄 표기. 우선순위: 확정 일시 > 조율 범위 > 미정.
export function formatGameSchedule({
  scheduleMode,
  confirmedAt,
  rangeStart,
  rangeEnd,
}: Pick<Game, "scheduleMode" | "confirmedAt" | "rangeStart" | "rangeEnd">): string {
  if (confirmedAt) return formatDateTime(confirmedAt);
  if (scheduleMode === SCHEDULE_MODE.coordinate && rangeStart && rangeEnd) {
    return `${formatDate(rangeStart)} — ${formatDate(rangeEnd)}`;
  }
  return "미정";
}
