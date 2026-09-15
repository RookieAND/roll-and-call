import { toKstDateTimeInput } from "./to-kst-date-time-input";

export function toKstDateInput(value: Date | string): string {
  return toKstDateTimeInput(value).slice(0, 10);
}
