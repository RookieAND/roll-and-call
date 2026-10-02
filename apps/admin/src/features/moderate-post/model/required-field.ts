import { POST_ACTION, type PostAction } from "./post-action";

export const REQUIRED_FIELD = {
  [POST_ACTION.hide]: "userReason",
  [POST_ACTION.unhide]: null,
  [POST_ACTION.resolve]: "staffMemo",
  [POST_ACTION.remove]: "userReason",
} as const satisfies Record<PostAction, "userReason" | "staffMemo" | null>;
