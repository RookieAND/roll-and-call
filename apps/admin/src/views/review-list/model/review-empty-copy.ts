import type { ReviewList } from "@/shared/server";
import { EMPTY_IMAGE } from "@/shared/ui";

import { reviewWindowEmptyCopy } from "./review-window-empty-copy";

// 칩의 구인에 후기가 없으면 출석 상태, 탭이 비었으면 탭 안내, 아니면 검색·사진 필터 결과 없음(필터 초기화).
export function reviewEmptyCopy({ list, hidden }: { list: ReviewList; hidden: boolean }) {
  if (list.game && list.counts.all === 0) {
    return { ...reviewWindowEmptyCopy(list.game.window), resettable: false };
  }
  if (hidden && list.counts.hidden === 0) {
    return {
      title: "숨긴 후기가 없습니다",
      description: "후기를 숨기면 이곳에서 모아 볼 수 있습니다.",
      image: EMPTY_IMAGE.hosted,
      resettable: false,
    };
  }
  if (list.counts.all === 0) {
    return {
      title: "아직 작성된 후기가 없습니다",
      description: "출석이 확정된 세션의 참석자가 후기를 쓰면 이곳에 표시됩니다.",
      image: EMPTY_IMAGE.hosted,
      resettable: false,
    };
  }
  return {
    title: "조건에 맞는 후기가 없습니다",
    description: undefined,
    image: EMPTY_IMAGE.search,
    resettable: true,
  };
}
