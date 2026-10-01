import "server-only";
import { db, games, profiles, sessionReviews } from "@roll-and-call/database";
import { and, desc, eq } from "drizzle-orm";

import { publicReviewsWhere } from "./public-reviews-where";
import { reviewCardColumns } from "./review-card-columns";

export async function getWrittenReviews(authorId: string) {
  return db
    .select(reviewCardColumns)
    .from(sessionReviews)
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(and(eq(sessionReviews.authorId, authorId), publicReviewsWhere))
    .orderBy(desc(sessionReviews.createdAt));
}
