import { and, desc, eq } from "drizzle-orm";

import { db } from "#/client";
import { games, profiles, sessionReviews } from "#/schema";

import { publicReviewsWhere } from "./public-reviews-where";
import { reviewCardColumns } from "./review-card-columns";

export async function getWrittenReviews({
  serverId,
  authorId,
  viewerId,
}: {
  serverId: string;
  authorId: string;
  viewerId: string | null;
}) {
  return db
    .select(reviewCardColumns(serverId))
    .from(sessionReviews)
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
    .where(and(eq(sessionReviews.authorId, authorId), publicReviewsWhere({ serverId, viewerId })))
    .orderBy(desc(sessionReviews.createdAt));
}
