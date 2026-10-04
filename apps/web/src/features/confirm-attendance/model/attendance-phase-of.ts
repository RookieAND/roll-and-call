import {
  isAttendancePastDeadline,
  isAutoConfirmedAttendance,
} from "@roll-and-call/database/games/model";
import { isNull } from "es-toolkit";

import { ATTENDANCE_PHASE, type AttendancePhase } from "./attendance-phase";

type Moment = Date | string | null;

// 기한이 지났는데 아직 크론 전이면(미확정) 자동 확정된 것으로 본다.
export function attendancePhaseOf({
  game,
  now = new Date(),
}: {
  game: {
    attendanceConfirmedAt: Moment;
    confirmedAt: Moment;
    playMinutes: number | null;
    endedAt: Moment;
  };
  now?: Date;
}): AttendancePhase {
  if (isAttendancePastDeadline({ ...game, now })) {
    const confirmedByGm = !isNull(game.attendanceConfirmedAt) && !isAutoConfirmedAttendance(game);
    return confirmedByGm ? ATTENDANCE_PHASE.closed : ATTENDANCE_PHASE.autoConfirmed;
  }
  return isNull(game.attendanceConfirmedAt) ? ATTENDANCE_PHASE.open : ATTENDANCE_PHASE.confirmed;
}
