export const ROUND_ROW_KIND = {
  finished: "finished",
  inProgress: "inProgress",
  scheduled: "scheduled",
  coordinating: "coordinating",
  unscheduled: "unscheduled",
  later: "later",
  cancelling: "cancelling",
} as const;

export type RoundRowKind = (typeof ROUND_ROW_KIND)[keyof typeof ROUND_ROW_KIND];
