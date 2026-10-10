// 이 달의 기록 순위를 매기는 방식. 서버마다 하나를 고른다(D407).
export const RANKING_MODE = { count: "count", points: "points" } as const;

export type RankingMode = (typeof RANKING_MODE)[keyof typeof RANKING_MODE];

export const RANKING_MODE_LABEL: Record<RankingMode, string> = {
  count: "참여 횟수제",
  points: "포인트제",
};

export function isRankingMode(value: string): value is RankingMode {
  return Object.values<string>(RANKING_MODE).includes(value);
}
