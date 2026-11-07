import { ruleGate, type EditionSet, type MyRulebooks } from "@/entities/rulebook";

const HOMEBREW_GROUP = {
  mine: { key: "homebrew:mine", name: "내가 만든 룰" },
  shared: { key: "homebrew:shared", name: "자작 룰" },
} as const;

// 순서는 내가 만든 룰, 일반 카테고리(이름 순), 다른 사람의 자작 룰이다. 기타 룰(R28) 자리는 아직 없다.
export function ruleSheetGroups({ data, query }: { data: MyRulebooks; query: string }) {
  const keyword = query.trim().toLowerCase();
  const matches = (set: EditionSet) =>
    !keyword ||
    [set.label, ...set.cores.flatMap((core) => [core.label, ...core.aliases])].some((text) =>
      text.toLowerCase().includes(keyword),
    );
  const option = (set: EditionSet) => ({ set, gate: ruleGate({ set, myRulebooks: data }) });
  const groups = new Map<string, { name: string; options: ReturnType<typeof option>[] }>();
  for (const set of data.sets.filter(matches)) {
    const { key, name } = set.homebrew
      ? HOMEBREW_GROUP[set.homebrew]
      : { key: set.categoryId, name: set.categoryName };
    const group = groups.get(key) ?? { name, options: [] };
    group.options.push(option(set));
    groups.set(key, group);
  }
  const ofKey = (key: string) => groups.get(key) ?? null;
  const categories = [...groups.entries()]
    .filter(([key]) => !key.startsWith("homebrew:"))
    .map(([, group]) => group)
    .toSorted((left, right) => left.name.localeCompare(right.name, "ko"));
  return [ofKey(HOMEBREW_GROUP.mine.key), ...categories, ofKey(HOMEBREW_GROUP.shared.key)].filter(
    (group) => group !== null,
  );
}
