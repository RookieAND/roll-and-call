export const SCHEDULE_TAB = {
  upcoming: "upcoming",
  past: "past",
} as const;

export type ScheduleTab = (typeof SCHEDULE_TAB)[keyof typeof SCHEDULE_TAB];
