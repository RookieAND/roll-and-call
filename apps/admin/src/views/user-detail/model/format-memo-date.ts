import { formatDate, formatMonthDay } from "@/shared/lib";

// 올해 메모는 월·일만, 지난해 메모는 연도까지 보여 준다.
export function formatMemoDate(date: Date) {
  const thisYear = formatDate(new Date()).slice(0, 5);
  const full = formatDate(date);
  return full.startsWith(thisYear) ? formatMonthDay(date) : full;
}
