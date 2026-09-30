// 단계 색. 뱃지 글씨·점이 받은 단계에 따라 이 색을 입는다.
export const BADGE_TONE = {
  muted: "muted",
  bronze: "bronze",
  primary: "primary",
  gold: "gold",
  hint: "hint",
  success: "success",
} as const;
export type BadgeTone = (typeof BADGE_TONE)[keyof typeof BADGE_TONE];
