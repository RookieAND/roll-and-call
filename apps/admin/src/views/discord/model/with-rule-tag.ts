import type { ForumTagForm } from "@/features/edit-forum-tags";

import { HOMEBREW_ROW } from "./forum-tag-rows";

interface WithRuleTagOptions {
  form: ForumTagForm;
  key: string;
  tagId: string;
}

// 룰 분류 표에서 고른 태그를 폼에 넣는다. 「자작 룰」 행은 카테고리가 아니라 form.homebrew다.
export function withRuleTag({ form, key, tagId }: WithRuleTagOptions): ForumTagForm {
  if (key === HOMEBREW_ROW.key) return { ...form, homebrew: tagId };
  return { ...form, categories: { ...form.categories, [key]: tagId } };
}
