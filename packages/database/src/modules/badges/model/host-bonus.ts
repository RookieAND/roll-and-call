import { RANKING_SESSION_KIND, type RankingSessionKind } from "./ranking-session-kind";

const FREE_PLAYERS = 3;
const MAX_BONUS_PLAYERS = 3;
const BONUS_PER_PLAYER = {
  [RANKING_SESSION_KIND.regular]: 20,
  [RANKING_SESSION_KIND.mini]: 10,
  [RANKING_SESSION_KIND.tieman]: 0,
} as const;

// GM만 받는 다인원 가점. 실제 참석 PL이 3명을 넘으면 1명마다, PL 6명분까지 센다.
export function hostBonus({
  kind,
  attendeePlayers,
}: {
  kind: RankingSessionKind;
  attendeePlayers: number;
}): number {
  const extra = Math.min(Math.max(attendeePlayers - FREE_PLAYERS, 0), MAX_BONUS_PLAYERS);
  return extra * BONUS_PER_PLAYER[kind];
}
