import { ATTENDANCE_PHASE, type AttendancePhase } from "./attendance-phase";

export const ATTENDANCE_GUIDE = {
  open: "open",
  reediting: "reediting",
  confirmed: "confirmed",
  autoConfirmed: "autoConfirmed",
  closed: "closed",
  frozen: "frozen",
} as const;

export type AttendanceGuide = (typeof ATTENDANCE_GUIDE)[keyof typeof ATTENDANCE_GUIDE];

// expired: 화면에서 확정하려다 기한이 지났다는 거절을 받았다. 다시 고치던 중이면 직전 결과로 굳는다(R24).
export function attendanceGuideKind({
  phase,
  editing,
  expired,
}: {
  phase: AttendancePhase;
  editing: boolean;
  expired: boolean;
}): AttendanceGuide {
  if (expired) {
    const wasConfirmed = phase === ATTENDANCE_PHASE.confirmed || phase === ATTENDANCE_PHASE.closed;
    return wasConfirmed ? ATTENDANCE_GUIDE.frozen : ATTENDANCE_GUIDE.autoConfirmed;
  }
  if (phase === ATTENDANCE_PHASE.confirmed) {
    return editing ? ATTENDANCE_GUIDE.reediting : ATTENDANCE_GUIDE.confirmed;
  }
  return phase;
}
