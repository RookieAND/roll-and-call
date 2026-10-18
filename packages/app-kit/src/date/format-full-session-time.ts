import { toKst } from "./to-kst";

export function formatFullSessionTime(value: Date | string) {
  return toKst(value).format("YYYY년 M월 D일 (dd) HH:mm");
}
