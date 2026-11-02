import { toKst } from "@roll-and-call/app-kit/date";

export function formatMonthDay(value: Date | string) {
  return toKst(value).format("M/D");
}
