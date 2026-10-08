import { nextInList } from "@/shared/lib";

import { plainText } from "./plain-text";
import { selectReviewRows, type ReviewListFilter } from "./select-review-rows";
import type { AdminUser, AuditEntry, Review, Session } from "./types";

// 작성자가 받은 조치로 세는 후기 조치(숨김 해제는 받은 조치가 아니다).
const RECEIVED_REVIEW_ACTIONS: readonly string[] = ["후기 숨김", "후기 제거"];

interface BuildReviewDetailOptions {
  reviews: Review[];
  users: AdminUser[];
  sessions: Session[];
  auditLog: AuditEntry[];
  id: string;
  // 들어온 목록의 탭·검색·사진·구인 칩·정렬. [다음 건]은 그 목록에서 다음 후기다.
  filter: ReviewListFilter;
  now: number;
}

// 지운 후기(작성자 삭제·운영진 제거)와 없는 id는 null이다.
export function buildReviewDetail({
  reviews,
  users,
  sessions,
  auditLog,
  id,
  filter,
  now,
}: BuildReviewDetailOptions) {
  const review = reviews.find((candidate) => candidate.id === id && !candidate.removed);
  if (!review) return null;
  const session = sessions.find((candidate) => candidate.id === review.sessionId)!;
  const author = users.find((user) => user.id === review.authorId)!;
  const { editedAt, hidden } = review;
  const listIds = selectReviewRows({ reviews, users, sessions, filter, now }).rows.map(
    (row) => row.id,
  );
  return {
    id: review.id,
    body: plainText(review.body),
    spoiler: review.spoiler,
    photoUrls: review.photoUrls,
    createdAt: review.createdAt,
    editedAt,
    hidden: hidden
      ? {
          reason: hidden.reason,
          by: hidden.by,
          at: hidden.at,
          editedAfterHidden: Boolean(editedAt && editedAt > hidden.at),
        }
      : undefined,
    held: review.held,
    game: { id: session.id, title: session.title },
    author: {
      id: author.id,
      nickname: author.nickname,
      reviewCount: reviews.filter(
        (candidate) => candidate.authorId === author.id && !candidate.removed,
      ).length,
      receivedActionCount: auditLog.filter(
        (entry) =>
          entry.targetUserId === author.id && RECEIVED_REVIEW_ACTIONS.includes(entry.action),
      ).length,
    },
    nextId: nextInList({ ids: listIds, currentId: id }),
  };
}

export type ReviewDetail = NonNullable<ReturnType<typeof buildReviewDetail>>;
