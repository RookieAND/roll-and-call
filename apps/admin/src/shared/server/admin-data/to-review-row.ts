import { compact } from "es-toolkit";

import { plainText } from "./plain-text";
import { REVIEW_LIST_TAB, type ReviewListTab } from "./review-list-tab";
import type { ReviewRow } from "./review-row";
import type { AdminUser, Review, Session } from "./types";

const UNKNOWN = "알 수 없음";

interface ToReviewRowOptions {
  review: Review;
  users: AdminUser[];
  sessions: Session[];
  tab: ReviewListTab;
}

// 상태 뱃지는 「숨김」·「스포일러 포함」 두 가지뿐이고, 숨긴 후기 탭에서는 「숨김」을 뺀다(D296(2)).
export function toReviewRow({ review, users, sessions, tab }: ToReviewRowOptions): ReviewRow {
  const session = sessions.find((candidate) => candidate.id === review.sessionId);
  const nicknameOf = (userId: string | undefined) =>
    users.find((user) => user.id === userId)?.nickname ?? UNKNOWN;
  return {
    id: review.id,
    createdAt: review.createdAt,
    authorNickname: nicknameOf(review.authorId),
    gameId: review.sessionId,
    gameTitle: session?.title ?? "",
    gmNickname: nicknameOf(session?.gmId),
    firstLine:
      plainText(review.body)
        .split("\n")
        .find((line) => line.trim()) ?? "",
    photoCount: review.photoUrls.length,
    badges: compact([
      review.hidden && tab !== REVIEW_LIST_TAB.hidden ? "숨김" : null,
      review.spoiler ? "스포일러 포함" : null,
    ]),
  };
}
