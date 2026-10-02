import { ruleGate, type EditionSet, type MyRulebooks } from "@/entities/rulebook";

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
    const group = groups.get(set.categoryId) ?? { name: set.categoryName, options: [] };
    group.options.push(option(set));
    groups.set(set.categoryId, group);
  }
  return [...groups.values()].toSorted((left, right) => left.name.localeCompare(right.name, "ko"));
}
