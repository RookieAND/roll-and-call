import "server-only";
import { db, games, profiles, sessionReviews } from "@roll-and-call/database";
import { and, desc, eq } from "drizzle-orm";

import { publicReviewsWhere } from "./public-reviews-where";
import { reviewCardColumns } from "./review-card-columns";

// GM으로 연 세션에 달린 후기.
export async function getReceivedReviews(gmId: string) {
  return db
    .select(reviewCardColumns)
    .from(sessionReviews)
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(and(eq(games.gmId, gmId), publicReviewsWhere))
    .orderBy(desc(sessionReviews.createdAt));
}
