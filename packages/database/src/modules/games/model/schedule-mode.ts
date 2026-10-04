import type { Game } from "#/schema/games";

// schedule_mode pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const SCHEDULE_MODES = [
  "fixed",
  "coordinate",
] as const satisfies readonly Game["scheduleMode"][];

export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

export const SCHEDULE_MODE = {
  fixed: "fixed",
  coordinate: "coordinate",
} as const satisfies Record<ScheduleMode, ScheduleMode>;
