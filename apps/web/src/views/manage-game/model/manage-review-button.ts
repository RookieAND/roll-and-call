export const MANAGE_REVIEW_BUTTON = {
  write: "write",
  view: "view",
} as const;
export type ManageReviewButton = (typeof MANAGE_REVIEW_BUTTON)[keyof typeof MANAGE_REVIEW_BUTTON];
