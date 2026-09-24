import type { MyRulebook } from "@/entities/rulebook";

// 시트는 룰북 이름으로 묶고 한 줄이 한 판본이다. 검색어는 이름·판본·다른 이름에서 찾는다.
export function groupRulebooks(rulebooks: MyRulebook[], query: string) {
  const keyword = query.trim().toLowerCase();
  const matches = (rulebook: MyRulebook) =>
    !keyword ||
    [rulebook.label, ...rulebook.aliases].some((text) => text.toLowerCase().includes(keyword));
  const groups = new Map<string, MyRulebook[]>();
  for (const rulebook of rulebooks.filter(matches)) {
    groups.set(rulebook.name, [...(groups.get(rulebook.name) ?? []), rulebook]);
  }
  return [...groups].map(([name, editions]) => ({ name, editions }));
}
