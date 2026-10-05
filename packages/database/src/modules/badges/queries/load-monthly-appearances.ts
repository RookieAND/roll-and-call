import { and, eq, gte, isNull, lt } from "drizzle-orm";

import { db } from "#/client";
import { type MonthlyAppearance } from "#/modules/badges/model/monthly-appearance";
import { recordAppearances } from "#/modules/badges/model/record-appearances";
import { reviewAppearances } from "#/modules/badges/model/review-appearances";
import { games, sessionReviews } from "#/schema";

import { reviewAuthorAbsent } from "./review-author-absent";

// 순위 점수 항목을 한 곳에서 만든다(홈·도감·이달의 뱃지·월간 발표가 모두 이 값을 쓴다).
// range를 주면 그 기간에 시작한 세션과 그 기간에 처음 공개한 후기만 읽는다.
// ponytail: range 없이는 끝난 세션을 한 번에 읽는다. 세션이 수만 건이 되면 달 단위 집계 쿼리로 바꾼다.
export async function loadMonthlyAppearances({
  serverId,
  now = new Date(),
  range,
}: {
  serverId: string;
  now?: Date;
  range?: { from: Date; to: Date };
}): Promise<MonthlyAppearance[]> {
  const [rows, reviews] = await Promise.all([
    db.query.games.findMany({
      columns: {
        id: true,
        gmId: true,
        confirmedAt: true,
        playMinutes: true,
        endedAt: true,
        hiddenAt: true,
        cancelledAt: true,
      },
      where: (game, { and, eq, gte, isNotNull, isNull, lt }) =>
        and(
          eq(game.serverId, serverId),
          isNotNull(game.confirmedAt),
          isNull(game.hiddenAt),
          isNull(game.cancelledAt),
          range && gte(game.confirmedAt, range.from),
          range && lt(game.confirmedAt, range.to),
        ),
      with: {
        rulebook: {
          columns: {},
          with: { category: { columns: { miniRule: true } } },
        },
        participants: {
          columns: { userId: true, status: true, absent: true, absenceCancelledAt: true },
          where: (participant, { eq }) => eq(participant.serverId, serverId),
        },
      },
    }),
    db
      .select({
        authorId: sessionReviews.authorId,
        createdAt: sessionReviews.createdAt,
        body: sessionReviews.body,
        hiddenAt: sessionReviews.hiddenAt,
        removedAt: sessionReviews.removedAt,
        authorAbsent: reviewAuthorAbsent,
      })
      .from(sessionReviews)
      .innerJoin(games, eq(games.id, sessionReviews.gameId))
      .where(
        and(
          eq(games.serverId, serverId),
          isNull(games.hiddenAt),
          isNull(games.cancelledAt),
          range && gte(sessionReviews.createdAt, range.from),
          range && lt(sessionReviews.createdAt, range.to),
        ),
      ),
  ]);
  return [...recordAppearances(rows, now), ...reviewAppearances(reviews)];
}
