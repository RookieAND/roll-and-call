import { and, eq } from "drizzle-orm";

import { db } from "../client";
import { sessionReviews } from "../schema";

export async function listGameReviewIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const reviews = await db
    .select({ id: sessionReviews.id })
    .from(sessionReviews)
    .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.gameId, gameId)));
  return reviews.map((review) => review.id);
}
