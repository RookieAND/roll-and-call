import { and, eq, gte, lt, not, sql } from "drizzle-orm";

import { db } from "#/client";
import type { MonthlyAppearance } from "#/modules/badges/model/monthly-winners";
import { reviewAppearances } from "#/modules/badges/model/record-appearances";
import { games, participants, sessionReviews } from "#/schema";

import { countedReviewWhere } from "./counted-review-where";

// 불참이 아닌 확정 참여자가 정확히 1명인 세션(isTieSession과 같은 기준).
const isTieGame = sql<boolean>`(
  select count(*) from ${participants}
  where ${participants.gameId} = ${games.id}
    and ${participants.status} = 'confirmed'
    and (not ${participants.absent} or ${participants.absenceCancelledAt} is not null)
) = 1`;

// 포인트제 후기 점수. 후기 업적과 같은 후기(공개, 공백 제외 10자 이상, 작성자가 불참이 아님)만 센다.
// 후기를 처음 공개한 달에 넣으므로 from·to는 후기를 쓴 시각 기준이다.
export async function loadReviewAppearances({
  serverId,
  from,
  to,
}: {
  serverId: string;
  from?: Date;
  to?: Date;
}): Promise<MonthlyAppearance[]> {
  const rows = await db
    .select({
      authorId: sessionReviews.authorId,
      gmId: games.gmId,
      createdAt: sessionReviews.createdAt,
    })
    .from(sessionReviews)
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(
      and(
        countedReviewWhere(serverId),
        // 타이만(1:1) 세션의 후기는 점수에 넣지 않는다.
        not(isTieGame),
        from ? gte(sessionReviews.createdAt, from) : undefined,
        to ? lt(sessionReviews.createdAt, to) : undefined,
      ),
    );
  return reviewAppearances(rows);
}
