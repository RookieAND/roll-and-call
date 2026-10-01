import { listGameReviewIds } from "@roll-and-call/database/review-forum";

import { syncReviewForumPost } from "./sync-review-forum-post";

// 출석을 고치면 작성자의 보류 여부가 바뀌므로 그 세션의 후기를 모두 다시 맞춘다.
export async function syncGameReviewForumPosts({
  serverId,
  gameId,
  siteOrigin,
}: {
  serverId: string;
  gameId: string;
  siteOrigin: string | undefined;
}) {
  for (const reviewId of await listGameReviewIds({ serverId, gameId }))
    await syncReviewForumPost({ serverId, reviewId, siteOrigin });
}
