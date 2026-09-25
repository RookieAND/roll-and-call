import type { DraftCategory } from "./draft-category";

export function categoryHelp(category: DraftCategory) {
  if (!category.name) return undefined;
  if (category.exists) return `기존 카테고리입니다. 책 ${category.bookCount}권이 있습니다.`;
  return category.typed
    ? "새 카테고리입니다."
    : "새 카테고리입니다. 기본값으로 룰북 이름을 넣었습니다.";
}
