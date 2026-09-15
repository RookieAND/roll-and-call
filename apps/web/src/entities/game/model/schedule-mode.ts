import type { Game } from "@/shared/server";

// Mirrors the `schedule_mode` pgEnum; `satisfies` fails to compile if the app drifts from it.
export const SCHEDULE_MODES = [
  "fixed",
  "coordinate",
] as const satisfies readonly Game["scheduleMode"][];

export type ScheduleMode = (typeof SCHEDULE_MODES)[number];

export const SCHEDULE_MODE = {
  fixed: "fixed",
  coordinate: "coordinate",
} as const satisfies Record<ScheduleMode, ScheduleMode>;
