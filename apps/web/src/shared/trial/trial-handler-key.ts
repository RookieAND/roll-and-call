export const TRIAL_HANDLER = {
  joinGame: "joinGame",
  leaveGame: "leaveGame",
  submitReview: "submitReview",
  discardReviewPhotos: "discardReviewPhotos",
  submitCertification: "submitCertification",
  createGame: "createGame",
} as const;
export type TrialHandlerKey = (typeof TRIAL_HANDLER)[keyof typeof TRIAL_HANDLER];
