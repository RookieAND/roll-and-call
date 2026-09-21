// 세션이 끝난 뒤 명단이 서는 두 단계. 끝나기 전에는 null이다.
export const ATTENDANCE_STAGE = {
  due: "due",
  done: "done",
} as const;

export type AttendanceStage = (typeof ATTENDANCE_STAGE)[keyof typeof ATTENDANCE_STAGE];
