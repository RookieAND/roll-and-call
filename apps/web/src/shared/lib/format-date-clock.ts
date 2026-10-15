import { toKst } from "@roll-and-call/app-kit/date";

export function formatDateClock(value: Date | string) {
  return toKst(value).format("M월 D일 HH:mm");
}
