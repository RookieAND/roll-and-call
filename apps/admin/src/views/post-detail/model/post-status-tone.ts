import { POST_STATUS, type PostStatus } from "@/shared/server";

export const POST_STATUS_TONE = {
  [POST_STATUS.recruiting]: "primary",
  [POST_STATUS.scheduling]: "warning",
  [POST_STATUS.confirmed]: "success",
  [POST_STATUS.ended]: "gray",
} as const satisfies Record<PostStatus, string>;
