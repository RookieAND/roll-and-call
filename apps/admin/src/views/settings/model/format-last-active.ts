import { formatDate, formatDateTime } from "@/shared/lib";

// 오늘 활동은 "오늘 14:38", 그 전은 날짜만.
export function formatLastActive(date: Date, now: Date = new Date()) {
  const today = formatDate(now);
  if (formatDate(date) !== today) return formatDate(date);
  return `오늘 ${formatDateTime(date).split(" ").at(-1)}`;
}
