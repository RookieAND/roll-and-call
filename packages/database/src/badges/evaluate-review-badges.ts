import { eq } from "drizzle-orm";

import { db } from "../client";
import { games, sessionReviews } from "../schema";
import { evaluateBadges } from "./evaluate-badges";

// 후기를 숨기거나 지우거나 되돌리면 그 세션 GM의 받은 후기, 작성자의 작성한 후기 뱃지가 바뀐다.
export async function evaluateReviewBadges(reviewId: string) {
  const [review] = await db
    .select({ gmId: games.gmId, authorId: sessionReviews.authorId })
    .from(sessionReviews)
    .innerJoin(games, eq(games.id, sessionReviews.gameId))
    .where(eq(sessionReviews.id, reviewId));
  if (review) await evaluateBadges([review.gmId, review.authorId]);
}
