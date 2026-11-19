import { MANAGE_REVIEW_BUTTON, type ManageReviewButton } from "./manage-review-button";
import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

export function gmReviewRow({
  gmReview,
  gameId,
}: {
  gmReview: ManageReviewButton | null;
  gameId: string;
}): ManageRow | null {
  const base = { key: "reviewWrite", icon: "pencil", state: MANAGE_ROW_STATE.open } as const;
  if (gmReview === MANAGE_REVIEW_BUTTON.write) {
    return {
      ...base,
      label: "마스터링 후기 작성하기",
      detail: "진행한 세션에 대한 GM 후기를 남깁니다",
      href: `/games/${gameId}/review`,
    };
  }
  if (gmReview === MANAGE_REVIEW_BUTTON.view) {
    return {
      ...base,
      label: "내 마스터링 후기 보기",
      detail: "내가 남긴 GM 후기를 봅니다",
      href: "/me/reviews",
    };
  }
  return null;
}
