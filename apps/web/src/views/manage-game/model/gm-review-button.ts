import { ddayKst, formatDday } from "@/shared/lib";

import { MANAGE_REVIEW_BUTTON, type ManageReviewButton } from "./manage-review-button";
import type { ManageRow } from "./manage-row-state";

export function gmReviewButton({
  gmReview,
  gameId,
  deadline,
  now,
}: {
  gmReview: ManageReviewButton | null;
  gameId: string;
  deadline: Date;
  now: Date;
}): ManageRow["button"] {
  if (gmReview === MANAGE_REVIEW_BUTTON.write) {
    return {
      label: "마스터링 후기 쓰기",
      href: `/games/${gameId}/review`,
      solid: true,
      caption: `후기 마감 ${formatDday(ddayKst(deadline, now))}`,
    };
  }
  if (gmReview === MANAGE_REVIEW_BUTTON.view) {
    return { label: "내 후기 보기", href: "/me/reviews", solid: false };
  }
}
