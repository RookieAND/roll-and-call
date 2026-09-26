import { groupByCategory, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

import { filterRulebooks } from "./filter-rulebooks";

const MAX_ALIASES = 2;

// 책 고르기 첫 화면의 카테고리 목록. 인증 없이 열 수 있는 카테고리는 뺀다. 줄임말은 기본 룰북의 다른 이름에서 두 개까지 빌려 온다.
export function pickerCategories(rulebooks: MyRulebook[], query: string) {
  const matched = new Set(filterRulebooks(rulebooks, query).map((rulebook) => rulebook.categoryId));
  return groupByCategory(rulebooks)
    .filter(
      (category) =>
        matched.has(category.id) && category.rulebooks.some((rulebook) => rulebook.certRequired),
    )
    .map((category) => {
      const aliases = category.rulebooks
        .filter((rulebook) => rulebook.kind === RULEBOOK_KIND.core)
        .flatMap((rulebook) => rulebook.aliases);
      const editions = category.editions.map(({ edition }) => edition || "기본판");
      return {
        id: category.id,
        name: category.name,
        aliases: [...new Set(aliases)].slice(0, MAX_ALIASES),
        meta: editions.join(" · "),
        editions: category.editions,
      };
    });
}

export type PickerCategory = ReturnType<typeof pickerCategories>[number];
