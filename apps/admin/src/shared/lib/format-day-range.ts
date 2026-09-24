import { formatMonthDay } from "./format-month-day";

// "9월 16일~22일", 달이 바뀌면 "8월 30일~9월 5일"
export function formatDayRange(from: Date, to: Date) {
  const start = formatMonthDay(from);
  const end = formatMonthDay(to);
  const sameMonth = start.split(" ")[0] === end.split(" ")[0];
  return `${start}~${sameMonth ? end.split(" ")[1] : end}`;
}
