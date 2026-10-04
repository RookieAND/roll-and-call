export const GRANT_SKIP_REASON = {
  alreadyCertified: "alreadyCertified",
  supplementBlocked: "supplementBlocked",
} as const;
export type GrantSkipReason = (typeof GRANT_SKIP_REASON)[keyof typeof GRANT_SKIP_REASON];
