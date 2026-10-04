import type { MyRulebook } from "@/entities/rulebook";

import { pickerCategories, type PickerCategory } from "../model/picker-categories";

export function pickerListing({
  rulebooks,
  query,
  recent,
  allCategories,
  showAll,
}: {
  rulebooks: MyRulebook[];
  query: string;
  recent: PickerCategory[];
  allCategories: PickerCategory[];
  showAll: boolean;
}) {
  if (query.trim() !== "") {
    const categories = pickerCategories({ rulebooks, query });
    return { categories, title: `검색 결과 ${categories.length}개`, recentOnly: false };
  }
  if (recent.length > 0 && !showAll) {
    return { categories: recent, title: "최근 구인을 연 룰", recentOnly: true };
  }
  return { categories: allCategories, title: "", recentOnly: false };
}
