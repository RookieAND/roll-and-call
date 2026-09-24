export const POST_DETAIL_TAB = {
  reports: "reports",
  content: "content",
  members: "members",
  waitlist: "waitlist",
} as const;
export type PostDetailTab = (typeof POST_DETAIL_TAB)[keyof typeof POST_DETAIL_TAB];
