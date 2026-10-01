import { and, desc, eq } from "drizzle-orm";

import { db } from "../../client";
import { games, sessionReviews } from "../../schema";
import { ownReviewsWhere } from "./own-reviews-where";
import { reviewAuthorAbsentSql } from "./review-author-absent-sql";

export async function getMyReviews({ serverId, authorId }: { serverId: string; authorId: string }) {
  return db
    .select({
      id: sessionReviews.id,
      gameId: sessionReviews.gameId,
      body: sessionReviews.body,
      spoiler: sessionReviews.spoiler,
      photoUrls: sessionReviews.photoUrls,
      createdAt: sessionReviews.createdAt,
      updatedAt: sessionReviews.updatedAt,
      hiddenAt: sessionReviews.hiddenAt,
      hiddenReason: sessionReviews.hiddenReason,
      removedAt: sessionReviews.removedAt,
      removedReason: sessionReviews.removedReason,
      authorAbsent: reviewAuthorAbsentSql,
      gameTitle: games.title,
      gameRule: games.rule,
      sessionAt: games.confirmedAt,
    })
    .from(sessionReviews)
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
    .where(ownReviewsWhere({ serverId, authorId }))
    .orderBy(desc(sessionReviews.createdAt));
}

export type MyReviewRow = Awaited<ReturnType<typeof getMyReviews>>[number];
