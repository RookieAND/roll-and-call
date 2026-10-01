import { formatDate } from "@roll-and-call/database/moderation/model";

export function formatDayRange(from: Date, to: Date) {
  const [, startMonth] = formatDate(from).split(" ");
  const [, endMonth, endDay] = formatDate(to).split(" ");
  const end = startMonth === endMonth ? endDay : `${endMonth} ${endDay}`;
  return `${formatDate(from)}~${end}`;
}
