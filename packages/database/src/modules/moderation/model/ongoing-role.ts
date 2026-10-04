export const ONGOING_ROLE = {
  gm: "gm",
  confirmed: "confirmed",
  waiting: "waiting",
} as const;
export type OngoingRole = (typeof ONGOING_ROLE)[keyof typeof ONGOING_ROLE];
