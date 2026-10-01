import { uniq } from "es-toolkit";

import { RULEBOOK_KIND } from "./rulebook-kind";
import type { MyRulebook } from "./to-my-rulebooks";

export function groupByCategory(rulebooks: MyRulebook[]) {
  const kindOrder = Object.values(RULEBOOK_KIND);
  const categories = new Map<string, { id: string; name: string; rulebooks: MyRulebook[] }>();
  for (const rulebook of rulebooks) {
    const category = categories.get(rulebook.categoryId) ?? {
      id: rulebook.categoryId,
      name: rulebook.categoryName,
      rulebooks: [],
    };
    category.rulebooks.push(rulebook);
    categories.set(rulebook.categoryId, category);
  }
  return [...categories.values()].map((category) => {
    const editions = uniq(category.rulebooks.map((rulebook) => rulebook.edition)).toSorted(
      (left, right) => right.localeCompare(left, "ko", { numeric: true }),
    );
    return {
      ...category,
      editions: editions.map((edition) => ({
        edition,
        rulebooks: category.rulebooks
          .filter((rulebook) => rulebook.edition === edition)
          .toSorted((left, right) => kindOrder.indexOf(left.kind) - kindOrder.indexOf(right.kind)),
      })),
    };
  });
}
