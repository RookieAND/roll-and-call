export const REVIEW_PERSPECTIVE = {
  session: "session",
  received: "received",
  written: "written",
} as const;

export type ReviewPerspective = (typeof REVIEW_PERSPECTIVE)[keyof typeof REVIEW_PERSPECTIVE];
