import { formatDate } from "@/shared/lib";
import { REVIEW_WINDOW_STATE, type ReviewList } from "@/shared/server";
import { EMPTY_IMAGE } from "@/shared/ui";

type ReviewWindow = NonNullable<ReviewList["game"]>["window"];

// 구인 칩이 붙은 채 그 구인 후기가 0건일 때. 경과 일수 문구는 쓰지 않는다.
export function reviewWindowEmptyCopy({ state, deadline }: ReviewWindow) {
  if (state === REVIEW_WINDOW_STATE.pending || !deadline) {
    return {
      title: "아직 출석이 확정되지 않았습니다",
      description: "출석이 확정되면 참석자가 후기를 쓸 수 있습니다.",
      image: EMPTY_IMAGE.schedule,
    };
  }
  if (state === REVIEW_WINDOW_STATE.open) {
    return {
      title: "아직 작성된 후기가 없습니다",
      description: `참석자는 ${formatDate(deadline)}까지 후기를 쓸 수 있습니다.`,
      image: EMPTY_IMAGE.hosted,
    };
  }
  return {
    title: "작성된 후기가 없습니다",
    description: `작성 기한(${formatDate(deadline)})이 지났습니다.`,
    image: EMPTY_IMAGE.hosted,
  };
}
