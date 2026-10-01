export const BADGE_TONE = {
  muted: "muted",
  bronze: "bronze",
  primary: "primary",
  gold: "gold",
  prism: "prism",
  developer: "developer",
  guild: "guild",
  hint: "hint",
  success: "success",
} as const;
export type BadgeTone = (typeof BADGE_TONE)[keyof typeof BADGE_TONE];
