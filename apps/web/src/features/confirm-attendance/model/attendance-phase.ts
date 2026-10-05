// 서버가 정하는 출석 확인 단계. 기한은 실제 종료 + 24시간이다.
export const ATTENDANCE_PHASE = {
  open: "open",
  confirmed: "confirmed",
  autoConfirmed: "autoConfirmed",
  closed: "closed",
} as const;

export type AttendancePhase = (typeof ATTENDANCE_PHASE)[keyof typeof ATTENDANCE_PHASE];
