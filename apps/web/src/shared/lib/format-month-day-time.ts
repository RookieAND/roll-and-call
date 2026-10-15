import { toKst } from "@roll-and-call/app-kit/date";

export function formatMonthDayTime(value: Date | string) {
  return toKst(value).format("M/D (dd) HH:mm");
}
