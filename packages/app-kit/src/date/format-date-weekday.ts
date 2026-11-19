import { toKst } from "./to-kst";

// 「10월 31일 (토)」
export function formatDateWeekday(value: Date | string) {
  return toKst(value).format("M월 D일 (dd)");
}
