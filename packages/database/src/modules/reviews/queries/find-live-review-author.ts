import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { sessionReviews } from "#/schema";

// 지워지지 않은 후기의 작성자. 없으면 undefined.
export async function findLiveReviewAuthor({
  serverId,
  reviewId,
}: {
  serverId: string;
  reviewId: string;
}) {
  const [review] = await db
    .select({ authorId: sessionReviews.authorId })
    .from(sessionReviews)
    .where(
      and(
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.id, reviewId),
        isNull(sessionReviews.removedAt),
      ),
    );
  return review?.authorId;
}
