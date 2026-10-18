import { REVIEW_AUTHOR_ROLE } from "@roll-and-call/database/games/model";
import type { ReviewCardRow } from "@roll-and-call/database/reviews";

import { formatDate } from "@/shared/lib";

import { REVIEW_PERSPECTIVE, type ReviewPerspective } from "./review-perspective";

// 카드 첫 줄은 늘 작성자(아바타 옆 이름)이고 둘째 줄이 맥락과 날짜다. 작성한 후기 목록만 작성자가 모두 같은 사람이라 첫 줄에 구인 제목을 둔다.
// 작성자 이름은 프로필 링크로 그리므로 문구와 따로 낸다. title이 null이면 첫 줄은 작성자다.
export function reviewCardText({
  row,
  perspective,
}: {
  row: ReviewCardRow;
  perspective: ReviewPerspective;
}) {
  const date = formatDate(row.createdAt) + (row.updatedAt ? " · 수정됨" : "");
  switch (perspective) {
    case REVIEW_PERSPECTIVE.session:
      if (row.authorRole === REVIEW_AUTHOR_ROLE.gm) {
        return { title: null, meta: `마스터링 후기 · ${date}` };
      }
      return { title: null, meta: date };
    case REVIEW_PERSPECTIVE.received:
      return { title: null, meta: `${row.gameTitle} · ${date}` };
    case REVIEW_PERSPECTIVE.written:
      return { title: row.gameTitle, meta: date };
  }
}
