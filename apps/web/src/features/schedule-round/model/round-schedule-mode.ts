export const ROUND_SCHEDULE_MODE = {
  direct: "direct",
  coordinate: "coordinate",
} as const;

export type RoundScheduleMode = (typeof ROUND_SCHEDULE_MODE)[keyof typeof ROUND_SCHEDULE_MODE];

export function isRoundScheduleMode(value: string | null): value is RoundScheduleMode {
  return value === ROUND_SCHEDULE_MODE.direct || value === ROUND_SCHEDULE_MODE.coordinate;
}
