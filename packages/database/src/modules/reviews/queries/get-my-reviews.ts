import { and, desc, eq } from "drizzle-orm";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games, profiles, sessionReviews } from "#/schema";

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
      hiddenReasonCode: sessionReviews.hiddenReasonCode,
      hiddenReasonText: sessionReviews.hiddenReasonText,
      removedAt: sessionReviews.removedAt,
      removedReasonCode: sessionReviews.removedReasonCode,
      removedReasonText: sessionReviews.removedReasonText,
      authorAbsent: reviewAuthorAbsentSql,
      authorName: memberNicknameSql(serverId),
      authorAvatarUrl: profiles.avatarUrl,
      gameTitle: games.title,
      gameRule: games.rule,
      sessionAt: games.confirmedAt,
    })
    .from(sessionReviews)
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .where(ownReviewsWhere({ serverId, authorId }))
    .orderBy(desc(sessionReviews.createdAt));
}

export type MyReviewRow = Awaited<ReturnType<typeof getMyReviews>>[number];
