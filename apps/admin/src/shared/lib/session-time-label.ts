import { isNull } from "es-toolkit";

import { formatSessionTime } from "./format-session-time";

// 세션 일시가 아직 정해지지 않았으면 「미정」이다.
export function sessionTimeLabel(sessionAt: Date | null) {
  return isNull(sessionAt) ? "미정" : formatSessionTime(sessionAt);
}
