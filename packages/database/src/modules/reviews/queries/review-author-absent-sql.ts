import { sql } from "drizzle-orm";

import { participants, sessionReviews } from "#/schema";

// 운영진이 취소한 불참은 세지 않는다.
export const reviewAuthorAbsentSql = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.serverId} = ${sessionReviews.serverId}
    and ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;
