import { toKst } from "./to-kst";

export function formatDateClock(value: Date | string) {
  return toKst(value).format("M월 D일 HH:mm");
}
