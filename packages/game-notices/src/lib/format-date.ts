import { toKst } from "./to-kst";

export function formatDate(value: Date | string) {
  return toKst(value).format("M월 D일");
}
