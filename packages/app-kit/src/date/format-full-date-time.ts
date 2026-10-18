import { toKst } from "./to-kst";

export function formatFullDateTime(value: Date | string) {
  return toKst(value).format("YYYY년 M월 D일 HH:mm");
}
