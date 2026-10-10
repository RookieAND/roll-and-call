import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "#/client";
import type { MonthlyAppearance } from "#/modules/badges/model/monthly-winners";
import { reviewAppearances } from "#/modules/badges/model/record-appearances";
import { games, sessionReviews } from "#/schema";

import { countedReviewWhere } from "./counted-review-where";

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
    .select({ authorId: sessionReviews.authorId, createdAt: sessionReviews.createdAt })
    .from(sessionReviews)
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(
      and(
        countedReviewWhere(serverId),
        from ? gte(sessionReviews.createdAt, from) : undefined,
        to ? lt(sessionReviews.createdAt, to) : undefined,
      ),
    );
  return reviewAppearances(rows);
}
