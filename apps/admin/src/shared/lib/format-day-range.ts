import { formatDate } from "./format-date";

// "2026년 9월 16일~22일", 달이 바뀌면 "2026년 8월 30일~9월 5일"
export function formatDayRange(from: Date, to: Date) {
  const [, startMonth] = formatDate(from).split(" ");
  const [, endMonth, endDay] = formatDate(to).split(" ");
  const end = startMonth === endMonth ? endDay : `${endMonth} ${endDay}`;
  return `${formatDate(from)}~${end}`;
}
