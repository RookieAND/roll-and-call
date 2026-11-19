import { sql } from "drizzle-orm";

import { db } from "#db/client";
import type { ReviewAuthorRole } from "#db/modules/games/model";
import { gameRounds, sessionReviews } from "#db/schema";

// 같은 회차에 두 번 쓰면 유니크 제약 위반(23505)을 그대로 던진다. 막는 문구는 앱이 고른다.
export async function insertReview({
  serverId,
  gameId,
  authorId,
  authorRole,
  body,
  spoiler,
  photoUrls,
  roundId,
}: {
  serverId: string;
  gameId: string;
  authorId: string;
  authorRole: ReviewAuthorRole;
  body: string;
  spoiler: boolean;
  photoUrls: string[];
  // 다회차는 고른 회차, 없으면 회차 1이다.
  roundId?: string;
}) {
  const [created] = await db
    .insert(sessionReviews)
    .values({
      serverId,
      gameId,
      roundId:
        roundId ??
        sql`(select id from ${gameRounds} where ${gameRounds.gameId} = ${gameId} and ${gameRounds.roundNo} = 1)`,
      authorId,
      authorRole,
      body,
      spoiler,
      photoUrls,
    })
    .returning({ id: sessionReviews.id });
  return created?.id;
}
