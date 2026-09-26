import { ruleGate, type EditionSet, type MyRulebooks } from "@/entities/rulebook";

// 시트는 카테고리마다 한 묶음, 카테고리 이름 순. 검색어는 카테고리·판본·기본 룰북 이름과 다른 이름에서 찾는다.
export function ruleSheetGroups(data: MyRulebooks, query: string, now = new Date()) {
  const keyword = query.trim().toLowerCase();
  const matches = (set: EditionSet) =>
    !keyword ||
    [set.label, ...set.cores.flatMap((core) => [core.label, ...core.aliases])].some((text) =>
      text.toLowerCase().includes(keyword),
    );
  const option = (set: EditionSet) => ({ set, gate: ruleGate(set, data, now) });
  const groups = new Map<string, { name: string; options: ReturnType<typeof option>[] }>();
  for (const set of data.sets.filter(matches)) {
    const group = groups.get(set.categoryId) ?? { name: set.categoryName, options: [] };
    group.options.push(option(set));
    groups.set(set.categoryId, group);
  }
  return [...groups.values()].toSorted((left, right) => left.name.localeCompare(right.name, "ko"));
}
