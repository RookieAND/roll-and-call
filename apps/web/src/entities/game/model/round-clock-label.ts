import { toKst } from "@/shared/lib";

// 「오후 12:00」. 자정은 오전 12:00이다.
export function roundClockLabel(value: Date | string) {
  const time = toKst(value);
  const meridiem = time.hour() < 12 ? "오전" : "오후";
  return `${meridiem} ${time.format("h:mm")}`;
}
