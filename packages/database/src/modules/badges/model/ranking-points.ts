// 포인트제 서버의 이 달의 기록 배점(D407, D317~D329·D332). 점수는 저장하지 않고 기록에서 계산한다.
export const RANKING_SESSION_KIND = { regular: "regular", mini: "mini", tie: "tie" } as const;
export type RankingSessionKind = (typeof RANKING_SESSION_KIND)[keyof typeof RANKING_SESSION_KIND];

export const SESSION_POINTS: Record<RankingSessionKind, number> = {
  regular: 100,
  mini: 50,
  tie: 15,
};

// 참석한 플레이어가 이 수를 넘으면 1명마다 GM에게 가점을 주고, 가점은 CROWD_BONUS_PLAYERS명분까지만 준다.
export const CROWD_BASE_PLAYERS = 3;
export const CROWD_BONUS_PLAYERS = 3;
export const CROWD_BONUS_POINTS: Record<RankingSessionKind, number> = {
  regular: 20,
  mini: 10,
  tie: 0,
};

export const REVIEW_POINTS = 10;
export const ABSENCE_POINTS = -100;

const TIE_ATTENDED_COUNT = 1;

// 타이만(1:1)이 룰 종류보다 먼저다. 룰북이 없는 구인과 미니룰 분류의 룰북은 미니룰, 나머지는 정식이다.
export function rankingSessionKind({
  attendedCount,
  miniRule,
}: {
  attendedCount: number;
  miniRule: boolean;
}): RankingSessionKind {
  if (attendedCount === TIE_ATTENDED_COUNT) return RANKING_SESSION_KIND.tie;
  return miniRule ? RANKING_SESSION_KIND.mini : RANKING_SESSION_KIND.regular;
}

// GM에게만 준다. 정원이 아니라 실제로 참석한 플레이어 수로 센다.
export function crowdBonusPoints({
  kind,
  attendedCount,
}: {
  kind: RankingSessionKind;
  attendedCount: number;
}): number {
  const extraPlayers = Math.min(attendedCount - CROWD_BASE_PLAYERS, CROWD_BONUS_PLAYERS);
  return Math.max(0, extraPlayers) * CROWD_BONUS_POINTS[kind];
}
