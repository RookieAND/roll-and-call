import { TRIAL_KIND, type TrialKind } from "./trial-kind";

export const TRIAL_RESULT_COPY = {
  [TRIAL_KIND.firstCome]: {
    title: "선착순 신청이 확정됐습니다.",
    description: "선착순 구인은 신청하면 바로 확정됩니다.",
    badge: "확정",
    meta: "CoC 7판 · 선착순 4명",
  },
  [TRIAL_KIND.lottery]: {
    title: "추첨 신청이 접수됐습니다.",
    description: "추첨 구인은 신청을 마감한 뒤 추첨으로 확정됩니다.",
    badge: "추첨 대기",
    meta: "CoC 7판 · 추첨 4명",
  },
} as const satisfies Record<TrialKind, unknown>;

export const TRIAL_BOTH_COPY = {
  title: "두 방식을 모두 해 봤습니다.",
  description: "선착순과 추첨의 결과를 모두 확인했습니다.",
} as const;

export const TRIAL_GAME_TITLE = {
  [TRIAL_KIND.firstCome]: "[연습] 선착순 세션",
  [TRIAL_KIND.lottery]: "[연습] 추첨 세션",
} as const satisfies Record<TrialKind, string>;

export function otherTrialKind(kind: TrialKind): TrialKind {
  return kind === TRIAL_KIND.firstCome ? TRIAL_KIND.lottery : TRIAL_KIND.firstCome;
}
