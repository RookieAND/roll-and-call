import { formatDate } from "@/shared/lib";
import type { ReviewCardRow } from "@/shared/server";

import { REVIEW_PERSPECTIVE, type ReviewPerspective } from "./review-perspective";

// 작성자 이름은 프로필 링크로 그리므로 문구와 따로 낸다. 세션 후기는 제목 자리, 진행한 세션 후기는 보조 줄 앞에 붙는다.
export function reviewCardText({
  row,
  perspective,
}: {
  row: ReviewCardRow;
  perspective: ReviewPerspective;
}) {
  const meta = formatDate(row.createdAt) + (row.updatedAt ? " · 수정됨" : "");
  switch (perspective) {
    case REVIEW_PERSPECTIVE.session:
      return { title: null, byline: false, meta };
    case REVIEW_PERSPECTIVE.received:
      return { title: row.gameTitle, byline: true, meta };
    case REVIEW_PERSPECTIVE.written:
      return { title: row.gameTitle, byline: false, meta };
  }
}
