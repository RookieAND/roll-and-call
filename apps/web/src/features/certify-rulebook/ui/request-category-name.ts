import { NEW_CATEGORY, UNKNOWN } from "../model/rulebook-request-form";

export function requestCategoryName({
  category,
  newCategory,
}: {
  category: string;
  newCategory: string;
}) {
  if (category === NEW_CATEGORY) return newCategory.trim();
  if (category === "" || category === UNKNOWN) return "";
  return category;
}
