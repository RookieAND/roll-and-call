import type { Review } from "./types";

// 탭 건수는 검색어·사진 필터와 상관없이 센다(D274). 구인 칩이 있으면 부르는 쪽이 그 구인 후기만 넘긴다.
export function reviewTabCounts(reviews: Review[]) {
  return {
    all: reviews.length,
    hidden: reviews.filter((review) => review.hidden).length,
  };
}
