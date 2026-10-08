import { TRIAL_KIND, type TrialKind } from "./trial-kind";

export const TRIAL_REVIEW_GAME_ID = "trial-ended-session";

// 첫 신청에서 신청한 구인이 있으면 그 세션을 끝난 세션으로 이어 보이고, 없으면 선착순 세션을 쓴다.
export function endedSessionKind(applied: Partial<Record<TrialKind, true>>): TrialKind {
  return applied[TRIAL_KIND.lottery] && !applied[TRIAL_KIND.firstCome]
    ? TRIAL_KIND.lottery
    : TRIAL_KIND.firstCome;
}
