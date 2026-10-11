import { groupByCategory, type MyRulebook } from "@/entities/rulebook";

import { filterRulebooks } from "./filter-rulebooks";

export function pickerCategories({ rulebooks, query }: { rulebooks: MyRulebook[]; query: string }) {
  const matched = new Set(
    filterRulebooks({ rulebooks, query }).map((rulebook) => rulebook.categoryId),
  );
  return groupByCategory(rulebooks)
    .filter(
      (category) =>
        matched.has(category.id) && category.rulebooks.some((rulebook) => rulebook.certRequired),
    )
    .map((category) => {
      const editions = category.editions.map(({ edition }) => edition || "기본판");
      return {
        id: category.id,
        name: category.name,
        meta: editions.join(" · "),
        editions: category.editions,
      };
    });
}

export type PickerCategory = ReturnType<typeof pickerCategories>[number];
