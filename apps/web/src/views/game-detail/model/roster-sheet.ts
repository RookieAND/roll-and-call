export const ROSTER_SHEET = {
  lottery: "lottery",
  confirmed: "confirmed",
  waiting: "waiting",
} as const;

export type RosterSheet = (typeof ROSTER_SHEET)[keyof typeof ROSTER_SHEET];
