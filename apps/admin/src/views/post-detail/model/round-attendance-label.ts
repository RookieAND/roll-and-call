import { isNull } from "es-toolkit";

import type { AdminRound } from "./admin-rounds";
import { ROUND_STATUS, roundStatusOf } from "./round-status";

// 「4/5명」. 확정하지 않았거나 아직 끝나지 않은 회차는 null이다.
export function roundAttendanceLabel({ round, now }: { round: AdminRound; now: Date }) {
  if (isNull(round.attendanceConfirmedAt)) return null;
  if (roundStatusOf({ round, now }) !== ROUND_STATUS.ended) return null;
  const attended = round.attendees.filter((attendee) => attendee.attended).length;
  return `${attended}/${round.attendees.length}명`;
}
