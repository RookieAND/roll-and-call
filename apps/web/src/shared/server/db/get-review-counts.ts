import "server-only";
import { db, games, sessionReviews } from "@roll-and-call/database";
import { and, count, eq } from "drizzle-orm";

import { ownReviewsWhere } from "./own-reviews-where";
import { publicReviewsWhere } from "./public-reviews-where";

// own이면 작성한 후기에 본인만 보는 후기(숨김·보류·운영진 삭제)까지 센다.
export async function getReviewCounts(userId: string, { own = false } = {}) {
  const [[received], [written]] = await Promise.all([
    db
      .select({ value: count() })
      .from(sessionReviews)
      .innerJoin(games, eq(games.id, sessionReviews.gameId))
      .where(and(eq(games.gmId, userId), publicReviewsWhere)),
    db
      .select({ value: count() })
      .from(sessionReviews)
      .where(
        own
          ? ownReviewsWhere(userId)
          : and(eq(sessionReviews.authorId, userId), publicReviewsWhere),
      ),
  ]);
  return { received: received?.value ?? 0, written: written?.value ?? 0 };
}
