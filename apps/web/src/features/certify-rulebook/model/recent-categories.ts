import type { MyRulebook } from "@/entities/rulebook";

import type { PickerCategory } from "./picker-categories";

// 최근 구인을 연 룰의 카테고리. 최근 연 순, 인증할 게 없는 카테고리는 뺀다.
export function recentCategories({
  categories,
  rulebooks,
  recentRulebookIds,
}: {
  categories: PickerCategory[];
  rulebooks: MyRulebook[];
  recentRulebookIds: string[];
}) {
  const ids = recentRulebookIds.flatMap(
    (id) => rulebooks.find((rulebook) => rulebook.id === id)?.categoryId ?? [],
  );
  return [...new Set(ids)].flatMap(
    (id) => categories.find((category) => category.id === id && !category.free) ?? [],
  );
}
