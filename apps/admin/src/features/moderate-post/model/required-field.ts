import { POST_ACTION, type PostAction } from "./post-action";

// 확정 전에 꼭 채워야 하는 칸. 숨김 해제는 메모 없이도 확정할 수 있다.
export const REQUIRED_FIELD = {
  [POST_ACTION.edit]: "userReason",
  [POST_ACTION.hide]: "userReason",
  [POST_ACTION.unhide]: null,
  [POST_ACTION.resolve]: "staffMemo",
} as const satisfies Record<PostAction, "userReason" | "staffMemo" | null>;
