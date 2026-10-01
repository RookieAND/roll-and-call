export const ROSTER_GAUGE = {
  capacity: "capacity",
  waiting: "waiting",
  applicants: "applicants",
} as const;

export type RosterGauge = (typeof ROSTER_GAUGE)[keyof typeof ROSTER_GAUGE];
