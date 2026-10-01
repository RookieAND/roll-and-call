import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { sessionReviews } from "../../../schema";

// 작성자가 지운 후기도 다시 쓸 수 없으니 넣는다.
export async function getReviewedGames({
  serverId,
  authorId,
}: {
  serverId: string;
  authorId: string;
}) {
  const rows = await db
    .select({
      gameId: sessionReviews.gameId,
      createdAt: sessionReviews.createdAt,
      removedAt: sessionReviews.removedAt,
    })
    .from(sessionReviews)
    .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.authorId, authorId)));
  return new Map(rows.map(({ gameId, ...review }) => [gameId, review]));
}

export type ReviewedGames = Awaited<ReturnType<typeof getReviewedGames>>;
