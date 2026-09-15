import { formatDate } from "./format-date";
import { formatDateTime } from "./format-date-time";

// UI와 Discord 알림이 같은 문구를 쓴다.
export function formatGameSchedule({
  scheduleMode,
  confirmedAt,
  rangeStart,
  rangeEnd,
}: {
  scheduleMode: "fixed" | "coordinate";
  confirmedAt: Date | string | null;
  rangeStart: string | null;
  rangeEnd: string | null;
}): string {
  if (confirmedAt) return formatDateTime(confirmedAt);
  if (scheduleMode === "coordinate" && rangeStart && rangeEnd) {
    return `${formatDate(rangeStart)} ~ ${formatDate(rangeEnd)} 조율`;
  }
  return "미정";
}
