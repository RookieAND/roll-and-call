import "server-only";
import { db, sessionReviews } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

// 세션 카드가 "후기 쓰기"와 "내 후기 보기"를 가른다. 작성자가 지운 후기도 다시 쓸 수 없으니 넣는다.
export async function getReviewedGames(authorId: string) {
  const rows = await db
    .select({
      gameId: sessionReviews.gameId,
      createdAt: sessionReviews.createdAt,
      removedAt: sessionReviews.removedAt,
    })
    .from(sessionReviews)
    .where(eq(sessionReviews.authorId, authorId));
  return new Map(rows.map(({ gameId, ...review }) => [gameId, review]));
}

export type ReviewedGames = Awaited<ReturnType<typeof getReviewedGames>>;
