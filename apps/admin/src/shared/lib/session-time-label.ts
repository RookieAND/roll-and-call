import { formatFullSessionTime } from "@roll-and-call/app-kit/date";
import { isNull } from "es-toolkit";

// 세션 일시가 아직 정해지지 않았으면 「미정」이다.
export function sessionTimeLabel(sessionAt: Date | null) {
  return isNull(sessionAt) ? "미정" : formatFullSessionTime(sessionAt);
}
