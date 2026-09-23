import { toKst } from "./to-kst";

export function formatDateWeekday(value: Date | string) {
  return toKst(value).format("M월 D일 (dd)");
}
