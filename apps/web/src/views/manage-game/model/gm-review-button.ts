import { formatDate } from "@/shared/lib";

import { MANAGE_REVIEW_BUTTON, type ManageReviewButton } from "./manage-review-button";
import { MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

export function gmReviewRow({
  gmReview,
  gameId,
  deadline,
}: {
  gmReview: ManageReviewButton | null;
  gameId: string;
  deadline: Date;
}): ManageRow | null {
  const base = { key: "reviewWrite", icon: "pencil", state: MANAGE_ROW_STATE.open } as const;
  if (gmReview === MANAGE_REVIEW_BUTTON.write) {
    return {
      ...base,
      label: "마스터링 후기 작성하기",
      detail: `${formatDate(deadline)}까지 작성할 수 있습니다`,
      href: `/games/${gameId}/review`,
    };
  }
  if (gmReview === MANAGE_REVIEW_BUTTON.view) {
    return { ...base, label: "내 마스터링 후기 보기", detail: "", href: "/me/reviews" };
  }
  return null;
}
