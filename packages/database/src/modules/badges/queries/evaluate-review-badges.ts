import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { games, sessionReviews } from "../../../schema";
import { evaluateBadges } from "./evaluate-badges";

export async function evaluateReviewBadges({
  serverId,
  reviewId,
}: {
  serverId: string;
  reviewId: string;
}) {
  const [review] = await db
    .select({ gmId: games.gmId, authorId: sessionReviews.authorId })
    .from(sessionReviews)
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, reviewId)));
  if (review) await evaluateBadges({ serverId, userIds: [review.gmId, review.authorId] });
}
