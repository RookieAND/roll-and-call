export const TRIAL_KIND = { firstCome: "first_come", lottery: "lottery" } as const;
export type TrialKind = (typeof TRIAL_KIND)[keyof typeof TRIAL_KIND];

export const TRIAL_GAME_ID = {
  [TRIAL_KIND.firstCome]: "trial-game-first-come",
  [TRIAL_KIND.lottery]: "trial-game-lottery",
} as const;

export function trialKindOf(gameId: string): TrialKind | null {
  if (gameId === TRIAL_GAME_ID[TRIAL_KIND.firstCome]) return TRIAL_KIND.firstCome;
  if (gameId === TRIAL_GAME_ID[TRIAL_KIND.lottery]) return TRIAL_KIND.lottery;
  return null;
}

export const TRIAL_MINE_GAME_ID = "trial-game-mine";
