export const SCHEDULE_TAB = { mine: "mine", overlap: "overlap" } as const;
export type ScheduleTab = (typeof SCHEDULE_TAB)[keyof typeof SCHEDULE_TAB];
