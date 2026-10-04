import { formatDate } from "@roll-and-call/database/moderation/model";

// 해가 바뀌면 끝에도 연도를 쓴다.
export function formatDayRange(from: Date, to: Date) {
  const [startYear, startMonth] = formatDate(from).split(" ");
  const [endYear, endMonth, endDay] = formatDate(to).split(" ");
  if (startYear !== endYear) return `${formatDate(from)}~${formatDate(to)}`;
  const end = startMonth === endMonth ? endDay : `${endMonth} ${endDay}`;
  return `${formatDate(from)}~${end}`;
}
