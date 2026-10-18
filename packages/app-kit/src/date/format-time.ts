import { toKst } from "./to-kst";

export function formatTime(value: Date | string) {
  return toKst(value).format("HH:mm");
}
