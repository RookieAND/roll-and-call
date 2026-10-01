import { listGameReviewThreadIds } from "@roll-and-call/database/review-forum";
import { deleteDiscordThread } from "@roll-and-call/discord";

// 구인을 지우면 후기 행이 cascade로 사라져 스레드 id를 잃는다. 지우기 전에 부른다.
export async function deleteGameReviewForumPosts({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  for (const threadId of await listGameReviewThreadIds({ serverId, gameId }))
    await deleteDiscordThread(threadId);
}
