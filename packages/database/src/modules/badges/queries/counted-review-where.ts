import { and, eq, isNull, not, sql } from "drizzle-orm";

import { participantReviewWhere } from "#/modules/reviews/queries/participant-review-where";
import { games, participants, sessionReviews } from "#/schema";

// 후기 작성자가 지금 불참이면 보류된 후기라 세지 않는다.
const reviewAuthorAbsent = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;

// 공백을 뺀 글자가 10자 이상인 후기만 센다.
const REVIEW_MIN_LENGTH = 10;
const longEnoughReview = sql<boolean>`char_length(regexp_replace(${sessionReviews.body}, '\s', '', 'g')) >= ${REVIEW_MIN_LENGTH}`;

// 후기 사다리와 풀 캐스트가 같은 후기만 센다. games와 session_reviews가 조인된 쿼리에서 쓴다.
export function countedReviewWhere(serverId: string) {
  return and(
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
    participantReviewWhere,
    isNull(sessionReviews.removedAt),
    isNull(sessionReviews.hiddenAt),
    not(reviewAuthorAbsent),
    longEnoughReview,
  );
}
