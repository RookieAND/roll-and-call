import { toKst } from "./to-kst";

export function formatMonthDay(value: Date | string) {
  return toKst(value).format("M/D");
}
