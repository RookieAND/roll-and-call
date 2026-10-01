import { uniq } from "es-toolkit";

import type { MyRulebook } from "@/entities/rulebook";

import type { PickerCategory } from "./picker-categories";

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
  return uniq(ids).flatMap((id) => categories.find((category) => category.id === id) ?? []);
}
