import { isUndefined } from "es-toolkit";

import { sortRows, type SortDir } from "@/shared/lib";

import { REVIEW_LIST_TAB, type ReviewListTab } from "./review-list-tab";
import { REVIEW_PHOTO_FILTER } from "./review-photo-filter";
import type { ReviewRow } from "./review-row";
import { REVIEW_DEFAULT_SORT, type ReviewSortColumn } from "./review-sort";
import { reviewTabCounts } from "./review-tab-counts";
import { reviewWindowOf } from "./review-window-of";
import { toReviewRow } from "./to-review-row";
import type { AdminUser, Review, Session } from "./types";

export interface ReviewListFilter {
  tab: ReviewListTab;
  query?: string;
  photo?: string;
  game?: string;
  sort: { column: ReviewSortColumn; dir: SortDir };
}

interface SelectReviewRowsOptions {
  reviews: Review[];
  users: AdminUser[];
  sessions: Session[];
  filter: ReviewListFilter;
  now: number;
}

const ACCESSORS = {
  createdAt: (row: ReviewRow) => row.createdAt,
  author: (row: ReviewRow) => row.authorNickname,
};

const matchesPhoto = ({ review, photo }: { review: Review; photo: string | undefined }) => {
  if (photo === REVIEW_PHOTO_FILTER.with) return review.photoUrls.length > 0;
  if (photo === REVIEW_PHOTO_FILTER.without) return review.photoUrls.length === 0;
  return true;
};

// 지워진 후기(작성자 삭제·운영진 제거)는 빼고, 작성 시각 최신순으로 세운 뒤 고른 열로 안정 정렬한다.
// 모르는 구인 id면 칩 없이 전체로 본다.
export function selectReviewRows({
  reviews,
  users,
  sessions,
  filter,
  now,
}: SelectReviewRowsOptions) {
  const session = sessions.find((candidate) => candidate.id === filter.game);
  const pool = reviews.filter(
    (review) => !review.removed && (isUndefined(session) || review.sessionId === session.id),
  );
  const keyword = filter.query?.trim().toLowerCase();
  const matched = pool
    .filter((review) => filter.tab !== REVIEW_LIST_TAB.hidden || review.hidden)
    .filter((review) => matchesPhoto({ review, photo: filter.photo }))
    .map((review) => toReviewRow({ review, users, sessions, tab: filter.tab }))
    .filter(
      (row) =>
        !keyword ||
        row.authorNickname.toLowerCase().includes(keyword) ||
        row.gameTitle.toLowerCase().includes(keyword),
    );
  const byNewest = sortRows({ rows: matched, sort: REVIEW_DEFAULT_SORT, accessors: ACCESSORS });
  return {
    rows: sortRows({ rows: byNewest, sort: filter.sort, accessors: ACCESSORS }),
    counts: reviewTabCounts(pool),
    game: session
      ? { id: session.id, title: session.title, window: reviewWindowOf({ session, now }) }
      : null,
  };
}
