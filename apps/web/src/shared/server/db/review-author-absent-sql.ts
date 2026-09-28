import "server-only";
import { participants, sessionReviews } from "@roll-and-call/database";
import { sql } from "drizzle-orm";

// 작성자가 그 세션에 지금 불참으로 기록돼 있는지. 운영진이 취소한 불참은 세지 않는다.
export const reviewAuthorAbsentSql = sql<boolean>`exists (
  select 1 from ${participants}
  where ${participants.gameId} = ${sessionReviews.gameId}
    and ${participants.userId} = ${sessionReviews.authorId}
    and ${participants.absent}
    and ${participants.absenceCancelledAt} is null
)`;
