import type { ReviewModerationAction } from "@/shared/server";

export const REVIEW_ACTION = {
  hide: "hide",
  unhide: "unhide",
  remove: "remove",
} as const satisfies Record<string, ReviewModerationAction>;

export type ReviewAction = (typeof REVIEW_ACTION)[keyof typeof REVIEW_ACTION];
