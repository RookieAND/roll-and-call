import { uniq } from "es-toolkit";

import { groupByCategory, RULEBOOK_KIND, type MyRulebook } from "@/entities/rulebook";

import { filterRulebooks } from "./filter-rulebooks";

const MAX_ALIASES = 2;

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
      const aliases = category.rulebooks
        .filter((rulebook) => rulebook.kind === RULEBOOK_KIND.core)
        .flatMap((rulebook) => rulebook.aliases);
      const editions = category.editions.map(({ edition }) => edition || "기본판");
      return {
        id: category.id,
        name: category.name,
        aliases: uniq(aliases).slice(0, MAX_ALIASES),
        meta: editions.join(" · "),
        editions: category.editions,
      };
    });
}

export type PickerCategory = ReturnType<typeof pickerCategories>[number];
