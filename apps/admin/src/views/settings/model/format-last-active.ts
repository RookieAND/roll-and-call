import { formatDate, formatDateTime } from "@/shared/lib";

export function formatLastActive(date: Date, now: Date = new Date()) {
  const today = formatDate(now);
  if (formatDate(date) !== today) return formatDate(date);
  return `오늘 ${formatDateTime(date).split(" ").at(-1)}`;
}
