import { and, desc, eq } from "drizzle-orm";

import { db } from "#/client";
import { REVIEW_AUTHOR_ROLE } from "#/modules/games/model/review-author-role";
import { games, profiles, sessionReviews } from "#/schema";

import { publicReviewsWhere } from "./public-reviews-where";
import { reviewCardColumns } from "./review-card-columns";

export async function getGameReviews({
  serverId,
  gameId,
  viewerId,
}: {
  serverId: string;
  gameId: string;
  viewerId: string | null;
}) {
  const rows = await db
    .select(reviewCardColumns(serverId))
    .from(sessionReviews)
    .innerJoin(profiles, eq(profiles.id, sessionReviews.authorId))
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
    .where(and(eq(sessionReviews.gameId, gameId), publicReviewsWhere({ serverId, viewerId })))
    .orderBy(desc(sessionReviews.createdAt));
  // GM 후기는 구인당 최대 1건이라 참석자 후기와 따로 돌려준다.
  return {
    gmReview: rows.find((row) => row.authorRole === REVIEW_AUTHOR_ROLE.gm) ?? null,
    participantReviews: rows.filter((row) => row.authorRole !== REVIEW_AUTHOR_ROLE.gm),
  };
}

export type ReviewCardRow = Awaited<
  ReturnType<typeof getGameReviews>
>["participantReviews"][number];
