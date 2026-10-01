import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { reviewReports, sessionReviews } from "../../../schema";

// 행은 남겨 같은 세션에 다시 쓰지 못하게 하고, 본문·사진은 비운다. 남은 신고는 대상이 없어 기각으로 닫는다.
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
  const now = new Date();
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
      .set({ removedAt: now, body: "", photoUrls: [] })
      .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, reviewId)));
    await transaction
      .update(reviewReports)
      .set({ outcome: "dismissed", resolvedAt: now })
      .where(
        and(
          eq(reviewReports.serverId, serverId),
          eq(reviewReports.reviewId, reviewId),
          isNull(reviewReports.outcome),
        ),
      );
    return review;
  });
}
