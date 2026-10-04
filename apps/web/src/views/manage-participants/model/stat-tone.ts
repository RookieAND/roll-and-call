export const STAT_TONE = {
  neutral: "neutral",
  primary: "primary",
  success: "success",
} as const;

export type StatTone = (typeof STAT_TONE)[keyof typeof STAT_TONE];
