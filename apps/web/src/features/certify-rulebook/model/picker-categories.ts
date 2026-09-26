import { groupByCategory, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

import { filterRulebooks } from "./filter-rulebooks";

const MAX_ALIASES = 2;

// 책 고르기 첫 화면의 카테고리 목록. 줄임말은 기본 룰북의 다른 이름에서 두 개까지 빌려 온다.
export function pickerCategories(rulebooks: MyRulebook[], query: string) {
  const matched = new Set(filterRulebooks(rulebooks, query).map((rulebook) => rulebook.categoryId));
  return groupByCategory(rulebooks)
    .filter((category) => matched.has(category.id))
    .map((category) => {
      const aliases = category.rulebooks
        .filter((rulebook) => rulebook.kind === RULEBOOK_KIND.core)
        .flatMap((rulebook) => rulebook.aliases);
      const editions = category.editions.map(({ edition }) => edition || "기본판");
      return {
        id: category.id,
        name: category.name,
        alias: [...new Set(aliases)].slice(0, MAX_ALIASES).join(" · "),
        meta: editions.join(" · "),
        free: category.rulebooks.every((rulebook) => !rulebook.certRequired),
        editions: category.editions,
      };
    });
}

export type PickerCategory = ReturnType<typeof pickerCategories>[number];
