import { isNull } from "es-toolkit";

import { ATTENDANCE_EDIT_HOURS } from "./attendance-deadline";
import { roundEndAt } from "./round-end-at";

const HOUR_MS = 3_600_000;

type Moment = Date | string | null;

// 회차 종료 24시간 뒤. 이때까지 GM이 출석을 확정하지 않으면 자동 확정하고, 생략도 이때까지만 할 수 있다.
export function roundAttendanceDeadline(round: { plannedEndAt: Moment; endedAt: Moment }) {
  const endAt = roundEndAt(round);
  return isNull(endAt) ? null : new Date(endAt.getTime() + ATTENDANCE_EDIT_HOURS * HOUR_MS);
}
