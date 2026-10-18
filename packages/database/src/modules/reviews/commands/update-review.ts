import { and, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import { sessionReviews } from "#db/schema";

export async function updateReview({
  serverId,
  reviewId,
  body,
  spoiler,
  photoUrls,
}: {
  serverId: string;
  reviewId: string;
  body: string;
  spoiler: boolean;
  photoUrls: string[];
}) {
  await db
    .update(sessionReviews)
    .set({ body, spoiler, photoUrls, updatedAt: new Date() })
    .where(
      and(
        eq(sessionReviews.serverId, serverId),
        eq(sessionReviews.id, reviewId),
        isNull(sessionReviews.removedAt),
      ),
    );
}
