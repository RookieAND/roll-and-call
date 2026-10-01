import { SET_STATUS, setOf, setStatus, type MyRulebooks } from "@/entities/rulebook";

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
