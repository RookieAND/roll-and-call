import { RANKING_SESSION_KIND, type RankingSessionKind } from "./ranking-session-kind";

const SESSION_SCORE = {
  [RANKING_SESSION_KIND.regular]: 100,
  [RANKING_SESSION_KIND.mini]: 70,
  [RANKING_SESSION_KIND.tieman]: 10,
} as const;

export function sessionScore(kind: RankingSessionKind): number {
  return SESSION_SCORE[kind];
}
