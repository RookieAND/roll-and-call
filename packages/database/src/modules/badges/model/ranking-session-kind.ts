import { isTieSession } from "./is-tie-session";

export const RANKING_SESSION_KIND = { tieman: "tieman", mini: "mini", regular: "regular" } as const;
export type RankingSessionKind = (typeof RANKING_SESSION_KIND)[keyof typeof RANKING_SESSION_KIND];

// 타이만 → 미니룰 → 정식 순서로 판정한다. 룰북이 없는 구인은 미니룰이고, 룰북이 있으면 그 룰 분류의 미니룰 설정을 따른다.
export function rankingSessionKind({
  confirmedAttendeeCount,
  rulebookMiniRule,
  hasRulebook,
}: {
  confirmedAttendeeCount: number;
  rulebookMiniRule: boolean;
  hasRulebook: boolean;
}): RankingSessionKind {
  if (isTieSession(confirmedAttendeeCount)) return RANKING_SESSION_KIND.tieman;
  if (!hasRulebook || rulebookMiniRule) return RANKING_SESSION_KIND.mini;
  return RANKING_SESSION_KIND.regular;
}
