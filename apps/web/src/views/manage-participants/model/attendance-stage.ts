export const ATTENDANCE_STAGE = {
  due: "due",
  done: "done",
} as const;

export type AttendanceStage = (typeof ATTENDANCE_STAGE)[keyof typeof ATTENDANCE_STAGE];
