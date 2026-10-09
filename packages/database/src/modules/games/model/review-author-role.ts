export type ReviewAuthorRole = "participant" | "gm";

export const REVIEW_AUTHOR_ROLE = {
  participant: "participant",
  gm: "gm",
} as const satisfies Record<ReviewAuthorRole, ReviewAuthorRole>;
