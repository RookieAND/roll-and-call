import { formatFullDate } from "@roll-and-call/app-kit/date";

// 해가 바뀌면 끝에도 연도를 쓴다.
export function formatDayRange(from: Date, to: Date) {
  const [startYear, startMonth] = formatFullDate(from).split(" ");
  const [endYear, endMonth, endDay] = formatFullDate(to).split(" ");
  if (startYear !== endYear) return `${formatFullDate(from)}~${formatFullDate(to)}`;
  const end = startMonth === endMonth ? endDay : `${endMonth} ${endDay}`;
  return `${formatFullDate(from)}~${end}`;
}
