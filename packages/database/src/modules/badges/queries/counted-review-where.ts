import { and, eq, isNull, not, sql } from "drizzle-orm";

import { participantReviewWhere } from "#db/modules/reviews";
import { games, participants, sessionReviews } from "#db/schema";

// 후기 작성자가 지금 불참이면 보류된 후기라 세지 않는다.
const reviewAuthorAbsent = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;

// 후기 사다리와 풀 캐스트가 같은 후기만 센다. games와 session_reviews가 조인된 쿼리에서 쓴다.
// 글자 수는 작성 때 입력에서 막으므로(REVIEW_BODY_MIN_LENGTH) 집계에서는 다시 세지 않는다.
export function countedReviewWhere(serverId: string) {
  return and(
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    isNull(games.cancelledAt),
    participantReviewWhere,
    isNull(sessionReviews.removedAt),
    isNull(sessionReviews.hiddenAt),
    not(reviewAuthorAbsent),
  );
}
