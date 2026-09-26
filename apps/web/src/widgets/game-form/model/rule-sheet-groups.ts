import { ruleGate, type EditionSet, type MyRulebooks } from "@/entities/rulebook";

// 시트 순서: 내가 인증한 룰, 인증 없이 열 수 있는 룰, 인증이 필요한 룰. 검색어는 카테고리·판본·기본 룰북 이름과 다른 이름에서 찾는다.
export function ruleSheetGroups(data: MyRulebooks, query: string, now = new Date()) {
  const keyword = query.trim().toLowerCase();
  const matches = (set: EditionSet) =>
    !keyword ||
    [set.label, ...set.cores.flatMap((core) => [core.label, ...core.aliases])].some((text) =>
      text.toLowerCase().includes(keyword),
    );
  const shown = data.sets.filter(matches).map((set) => ({ set, gate: ruleGate(set, data, now) }));
  return {
    mine: shown.filter(({ set }) => set.earned),
    free: shown.filter(({ set }) => set.free),
    needed: shown.filter(({ set }) => !set.earned && !set.free),
  };
}
