import { groupByCategory, type MyRulebooks } from "@/entities/rulebook";

import { toCategoryCard } from "./to-category-card";

const byNewest = (left: { at: Date }, right: { at: Date }) =>
  right.at.getTime() - left.at.getTime();

// GM 가능은 최근순, 진행 중은 반려된 카테고리를 맨 위에 두고 최근순. 추가 요청은 진행 중 끝에 둔다.
export function categoryCards({ rulebooks, requests }: MyRulebooks) {
  const cards = groupByCategory(rulebooks).flatMap((category) => toCategoryCard(category) ?? []);
  return {
    ready: cards.filter((card) => card.gmReady).toSorted(byNewest),
    inProgress: cards
      .filter((card) => !card.gmReady)
      .toSorted(
        (left, right) => Number(right.rejected) - Number(left.rejected) || byNewest(left, right),
      ),
    requests: requests.map((request) => ({ ...request, at: request.createdAt })).toSorted(byNewest),
  };
}
