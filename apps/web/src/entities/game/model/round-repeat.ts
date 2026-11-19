export const ROUND_REPEAT = {
  weekly: "weekly",
  biweekly: "biweekly",
  custom: "custom",
} as const;

export const ROUND_REPEATS = [
  ROUND_REPEAT.weekly,
  ROUND_REPEAT.biweekly,
  ROUND_REPEAT.custom,
] as const;

export type RoundRepeat = (typeof ROUND_REPEATS)[number];

export const ROUND_REPEAT_WEEKS = {
  [ROUND_REPEAT.weekly]: 1,
  [ROUND_REPEAT.biweekly]: 2,
} as const;

export const ROUND_REPEAT_WORD = {
  [ROUND_REPEAT.weekly]: "매주",
  [ROUND_REPEAT.biweekly]: "격주",
} as const;

export type RoundRepeatWord = keyof typeof ROUND_REPEAT_WORD;
