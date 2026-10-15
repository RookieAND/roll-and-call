import { toKst } from "@roll-and-call/app-kit/date";

export function toKstDateInput(value: Date | string): string {
  return toKst(value).format("YYYY-MM-DD");
}
