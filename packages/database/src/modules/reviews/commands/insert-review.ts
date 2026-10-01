import { db } from "../../../client";
import { sessionReviews } from "../../../schema";

// 같은 세션에 두 번 쓰면 유니크 제약 위반(23505)을 그대로 던진다. 막는 문구는 앱이 고른다.
export async function insertReview({
  serverId,
  gameId,
  authorId,
  body,
  spoiler,
  photoUrls,
}: {
  serverId: string;
  gameId: string;
  authorId: string;
  body: string;
  spoiler: boolean;
  photoUrls: string[];
}) {
  const [created] = await db
    .insert(sessionReviews)
    .values({ serverId, gameId, authorId, body, spoiler, photoUrls })
    .returning({ id: sessionReviews.id });
  return created?.id;
}
