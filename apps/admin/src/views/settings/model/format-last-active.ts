import { formatFullDate, formatTime } from "@/shared/lib";

export function formatLastActive(date: Date, now: Date = new Date()) {
  const today = formatFullDate(now);
  if (formatFullDate(date) !== today) return formatFullDate(date);
  return `오늘 ${formatTime(date)}`;
}
