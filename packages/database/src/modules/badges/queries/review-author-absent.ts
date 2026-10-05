import { sql } from "drizzle-orm";

import { participants, sessionReviews } from "#/schema";

// 후기 작성자가 지금 불참이면 보류된 후기라 업적도 순위 점수도 세지 않는다.
export const reviewAuthorAbsent = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;
