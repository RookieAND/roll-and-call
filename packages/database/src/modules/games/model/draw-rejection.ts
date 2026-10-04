export const DRAW_REJECTION = {
  notFound: "not_found",
  notGm: "not_gm",
  cancelled: "cancelled",
  notLottery: "not_lottery",
  alreadyDrawn: "already_drawn",
  applicationClosed: "application_closed",
  noApplicants: "no_applicants",
  tooMany: "too_many",
} as const;

export type DrawRejection = (typeof DRAW_REJECTION)[keyof typeof DRAW_REJECTION];
