export const ATTENDANCE_CHOICE = {
  present: "present",
  absent: "absent",
} as const;

export type AttendanceChoice = (typeof ATTENDANCE_CHOICE)[keyof typeof ATTENDANCE_CHOICE];

export const ATTENDANCE_OPTIONS = [
  { value: ATTENDANCE_CHOICE.present, label: "참석" },
  { value: ATTENDANCE_CHOICE.absent, label: "불참" },
] as const;
