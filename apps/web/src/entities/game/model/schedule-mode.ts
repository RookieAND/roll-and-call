import type { Game } from "@/shared/server";
// Values mirror the `schedule_mode` pgEnum (source of truth in the DB schema).
// `satisfies` fails to compile if the app drifts from the DB enum.
export const SCHEDULE_MODES = [
  "fixed",
  "coordinate",
] as const satisfies readonly Game["scheduleMode"][];

export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

export const SCHEDULE_MODE = {
  fixed: "fixed",
  coordinate: "coordinate",
} as const satisfies Record<ScheduleMode, ScheduleMode>;
