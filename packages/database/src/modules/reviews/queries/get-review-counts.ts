import { and, count, eq } from "drizzle-orm";

import { db } from "#/client";
import { games, sessionReviews } from "#/schema";

import { ownReviewsWhere } from "./own-reviews-where";
import { participantReviewWhere } from "./participant-review-where";
import { publicReviewsWhere } from "./public-reviews-where";

// own이면 작성한 후기에 본인만 보는 후기(숨김·보류·운영진 삭제)까지 센다.
export async function getReviewCounts({
  serverId,
  userId,
  viewerId,
  own = false,
}: {
  serverId: string;
  userId: string;
  viewerId: string | null;
  own?: boolean;
}) {
  const [[received], [written]] = await Promise.all([
    db
      .select({ value: count() })
      .from(sessionReviews)
      .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, sessionReviews.gameId)))
      .where(
        and(
          eq(games.gmId, userId),
          participantReviewWhere,
          publicReviewsWhere({ serverId, viewerId }),
        ),
      ),
    db
      .select({ value: count() })
      .from(sessionReviews)
      .where(
        own
          ? and(ownReviewsWhere({ serverId, authorId: userId }), participantReviewWhere)
          : and(
              eq(sessionReviews.authorId, userId),
              participantReviewWhere,
              publicReviewsWhere({ serverId, viewerId }),
            ),
      ),
  ]);
  return { received: received?.value ?? 0, written: written?.value ?? 0 };
}
