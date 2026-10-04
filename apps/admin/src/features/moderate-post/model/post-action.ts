import type { PostModerationAction } from "@/shared/server";

export const POST_ACTION = {
  hide: "hide",
  unhide: "unhide",
  remove: "remove",
} as const satisfies Record<string, PostModerationAction>;

export type PostAction = (typeof POST_ACTION)[keyof typeof POST_ACTION];
