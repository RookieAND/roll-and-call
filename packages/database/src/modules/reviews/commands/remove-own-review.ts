import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { sessionReviews } from "#/schema";

// 행은 남겨 같은 세션에 다시 쓰지 못하게 하고, 본문·사진은 비운다.
// 이미 지워졌거나 남의 후기면 null.
export async function removeOwnReview({
  serverId,
  reviewId,
  authorId,
}: {
  serverId: string;
  reviewId: string;
  authorId: string;
}) {
  return db.transaction(async (transaction) => {
    const [review] = await transaction
      .select({ gameId: sessionReviews.gameId, photoUrls: sessionReviews.photoUrls })
      .from(sessionReviews)
      .where(
        and(
          eq(sessionReviews.serverId, serverId),
          eq(sessionReviews.id, reviewId),
          eq(sessionReviews.authorId, authorId),
          isNull(sessionReviews.removedAt),
        ),
      )
      .for("update");
    if (!review) return null;

    await transaction
      .update(sessionReviews)
      .set({ removedAt: new Date(), body: "", photoUrls: [] })
      .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, reviewId)));
    return review;
  });
}
