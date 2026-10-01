import { POST_ACTION, type PostAction } from "./post-action";

export const REQUIRED_FIELD = {
  [POST_ACTION.edit]: "userReason",
  [POST_ACTION.hide]: "userReason",
  [POST_ACTION.unhide]: null,
  [POST_ACTION.resolve]: "staffMemo",
} as const satisfies Record<PostAction, "userReason" | "staffMemo" | null>;
