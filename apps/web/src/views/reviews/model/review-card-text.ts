import { formatMonthDay } from "@/shared/lib";
import type { ReviewCardRow } from "@/shared/server";

import { REVIEW_PERSPECTIVE, type ReviewPerspective } from "./review-perspective";

export function reviewCardText(row: ReviewCardRow, perspective: ReviewPerspective) {
  const tail = formatMonthDay(row.createdAt) + (row.updatedAt ? " · 수정됨" : "");
  switch (perspective) {
    case REVIEW_PERSPECTIVE.session:
      return { title: row.authorName, meta: tail };
    case REVIEW_PERSPECTIVE.received:
      return { title: row.gameTitle, meta: `${row.authorName} · ${tail}` };
    case REVIEW_PERSPECTIVE.written:
      return { title: row.gameTitle, meta: tail };
  }
}
