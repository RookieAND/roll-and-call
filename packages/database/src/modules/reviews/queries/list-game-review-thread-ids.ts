import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "../../../client";
import { sessionReviews } from "../../../schema";

export async function listGameReviewThreadIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const reviews = await db
    .select({ threadId: sessionReviews.discordThreadId })
    .from(sessionReviews)
    .where(
      and(
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.gameId, gameId),
        isNotNull(sessionReviews.discordThreadId),
      ),
    );
  return reviews.map((review) => review.threadId!);
}
