import type { MyRulebook } from "@/entities/rulebook";

export function filterRulebooks(rulebooks: MyRulebook[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return rulebooks;
  const matches = (text: string) => text.toLowerCase().includes(keyword);
  return rulebooks.filter(
    (rulebook) =>
      matches(rulebook.categoryName) || [rulebook.label, ...rulebook.aliases].some(matches),
  );
}
