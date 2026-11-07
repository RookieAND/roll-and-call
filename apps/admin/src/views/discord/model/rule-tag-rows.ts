import type { ForumTagForm } from "@/features/edit-forum-tags";

import { HOMEBREW_ROW } from "./forum-tag-rows";

interface RuleTagRowsOptions {
  categories: { id: string; name: string }[];
  form: ForumTagForm;
  saved: ForumTagForm;
}

// 룰 분류 표의 행: 카테고리마다 한 줄, 맨 끝에 「자작 룰」 고정 행.
export function ruleTagRows({ categories, form, saved }: RuleTagRowsOptions) {
  return [
    ...categories.map((category) => ({
      key: category.id,
      label: category.name,
      value: form.categories[category.id] ?? "",
      savedValue: saved.categories[category.id] ?? "",
    })),
    {
      key: HOMEBREW_ROW.key,
      label: HOMEBREW_ROW.label,
      value: form.homebrew,
      savedValue: saved.homebrew,
    },
  ];
}
