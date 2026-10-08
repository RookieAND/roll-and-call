export const TRIAL_REVIEW_SCREEN = {
  write: "write",
  result: "result",
  session: "session",
} as const;
export type TrialReviewScreenName = (typeof TRIAL_REVIEW_SCREEN)[keyof typeof TRIAL_REVIEW_SCREEN];
