import type { PostModerationAction } from "@/shared/server";

export const POST_ACTION = {
  edit: "edit",
  hide: "hide",
  unhide: "unhide",
  resolve: "resolve",
} as const satisfies Record<string, PostModerationAction>;

export type PostAction = (typeof POST_ACTION)[keyof typeof POST_ACTION];
