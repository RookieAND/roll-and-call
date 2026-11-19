export const ROUND_MODE = {
  once: "once",
  multi: "multi",
} as const;

export const ROUND_MODES = [ROUND_MODE.once, ROUND_MODE.multi] as const;

export type RoundMode = (typeof ROUND_MODES)[number];
