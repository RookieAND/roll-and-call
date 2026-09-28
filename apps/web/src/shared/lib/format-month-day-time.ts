import { toKst } from "./to-kst";

export function formatMonthDayTime(value: Date | string) {
  return toKst(value).format("M/D (dd) HH:mm");
}
