import { toKst } from "./to-kst";

export function formatFullDate(value: Date | string) {
  return toKst(value).format("YYYY년 M월 D일");
}
