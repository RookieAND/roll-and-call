import type { SCHEDULE_NOTICE } from "./schedule-notices";

export const SCHEDULE_BODY_MODE = {
  confirmed: "confirmed",
  closed: "closed",
  paint: "paint",
  viewOnly: "viewOnly",
} as const;

type ScheduleNoticeContent = (typeof SCHEDULE_NOTICE)[keyof typeof SCHEDULE_NOTICE];

export type ScheduleBodyMode =
  | { kind: typeof SCHEDULE_BODY_MODE.confirmed; confirmedAt: Date }
  | { kind: typeof SCHEDULE_BODY_MODE.closed; notice: ScheduleNoticeContent }
  | { kind: typeof SCHEDULE_BODY_MODE.paint; showDeadlineNotice: boolean }
  | { kind: typeof SCHEDULE_BODY_MODE.viewOnly; isSignedIn: boolean };
