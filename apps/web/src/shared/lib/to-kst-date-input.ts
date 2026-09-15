import { toKst } from "./to-kst";

export function toKstDateInput(value: Date | string): string {
  return toKst(value).format("YYYY-MM-DD");
}
