export const APPLY_MODE = {
  single: "single",
  bulk: "bulk",
} as const;

export type ApplyMode = (typeof APPLY_MODE)[keyof typeof APPLY_MODE];
