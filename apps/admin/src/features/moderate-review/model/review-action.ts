import type { ReviewModerationAction } from "@/shared/server";

export const REVIEW_ACTION = {
  hide: "hide",
  unhide: "unhide",
  remove: "remove",
  dismiss: "dismiss",
} as const satisfies Record<string, ReviewModerationAction>;

export type ReviewAction = (typeof REVIEW_ACTION)[keyof typeof REVIEW_ACTION];

export const REASON_ACTIONS: readonly ReviewAction[] = [REVIEW_ACTION.hide, REVIEW_ACTION.remove];
