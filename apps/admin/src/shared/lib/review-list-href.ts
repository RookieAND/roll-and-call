import { withQuery } from "./with-query";

export const REVIEW_LIST_PATH = { all: "/reviews", hidden: "/reviews/hidden" } as const;

interface ReviewListHrefOptions {
  hidden: boolean;
  // 들어온 목록의 검색·사진·구인 칩·정렬(q, photo, game, sort, dir).
  query: Record<string, string | undefined>;
}

export function reviewListHref({ hidden, query }: ReviewListHrefOptions) {
  return withQuery(hidden ? REVIEW_LIST_PATH.hidden : REVIEW_LIST_PATH.all, query, {});
}
