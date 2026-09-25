import type { MyRulebook } from "@/entities/rulebook";

// 카테고리 이름이 맞으면 그 카테고리 책을 모두, 아니면 이름·판본·다른 이름이 맞는 책만.
export function filterRulebooks(rulebooks: MyRulebook[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return rulebooks;
  const matches = (text: string) => text.toLowerCase().includes(keyword);
  return rulebooks.filter(
    (rulebook) =>
      matches(rulebook.categoryName) || [rulebook.label, ...rulebook.aliases].some(matches),
  );
}
