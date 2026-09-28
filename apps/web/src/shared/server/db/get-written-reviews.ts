import "server-only";
import { db, games, profiles, sessionReviews } from "@roll-and-call/database";
import { and, desc, eq } from "drizzle-orm";

import { publicReviewsWhere } from "./public-reviews-where";
import { reviewCardColumns } from "./review-card-columns";

// 다른 사람에게 보이는, 이 사람이 쓴 후기.
export async function getWrittenReviews(authorId: string) {
  return db
    .select(reviewCardColumns)
    .from(sessionReviews)
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(and(eq(sessionReviews.authorId, authorId), publicReviewsWhere))
    .orderBy(desc(sessionReviews.createdAt));
}
