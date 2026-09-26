import { SET_STATUS, setOf, setStatus, type MyRulebooks } from "@/entities/rulebook";

// 최근 90일에 연 구인의 판본 가운데 아직 인증도 신청도 하지 않은 것. 최근 연 순.
export function recentUnopenedSets({ rulebooks, sets, recentRulebookIds }: MyRulebooks) {
  const found = recentRulebookIds.flatMap((rulebookId) => {
    const rulebook = rulebooks.find((candidate) => candidate.id === rulebookId);
    const set = rulebook && setOf(rulebook, sets);
    if (!set || set.opened) return [];
    const { status } = setStatus(set);
    return status === SET_STATUS.none || status === SET_STATUS.revoked ? [set] : [];
  });
  return [...new Map(found.map((set) => [set.key, set])).values()];
}
