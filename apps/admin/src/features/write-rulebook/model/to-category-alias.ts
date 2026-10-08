import { CATEGORY_ALIAS_MAX_LENGTH } from "./category-alias-max-length";

export function toCategoryAlias(text: string) {
  const [first = ""] = text.split(/[,\n\r]/);
  return first.trim().slice(0, CATEGORY_ALIAS_MAX_LENGTH) || null;
}
