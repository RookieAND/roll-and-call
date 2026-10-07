import { loadForumReview, saveThreadId } from "@roll-and-call/database/reviews";
import { getServerById } from "@roll-and-call/database/servers";
import {
  createFileMessage,
  createForumPost,
  deleteDiscordMessage,
  deleteDiscordThread,
  DISCORD_CHANNEL_TYPE,
  getDiscordChannel,
  getForumTags,
  updateFileMessage,
  updateForumPost,
} from "@roll-and-call/discord";
import { isNull } from "es-toolkit";

import { fetchPhotoFiles } from "./fetch-photo-files";
import { reviewForumPost } from "./review-forum-post";

const MESSAGE_MAX_LENGTH = 2000;

// 후기 채널이 포럼이면 게시글을, 텍스트 채널이면 메시지 하나를 올린다. 저장하는 id는 둘 다 threadId 칸에 둔다.
// ponytail: 같은 후기를 동시에 두 번 부르면 게시글이 둘 생길 수 있다. 작성·수정은 한 사람이 하므로 드물다.
export async function syncReviewForumPost({
  serverId,
  reviewId,
  siteOrigin,
}: {
  serverId: string;
  reviewId: string;
  siteOrigin: string | undefined;
}) {
  const server = await getServerById(serverId);
  const forumId = server?.reviewForumChannelId;
  if (!forumId) return;
  // 올릴 때마다 읽으므로 채널 종류를 바꿔도 설정을 고칠 필요가 없다.
  const forum = (await getDiscordChannel(forumId))?.type === DISCORD_CHANNEL_TYPE.forum;
  const removePost = (postId: string) =>
    forum
      ? deleteDiscordThread(postId)
      : deleteDiscordMessage({ channelId: forumId, messageId: postId });
  const review = await loadForumReview({ serverId, reviewId });
  if (!review) return;

  const held = Boolean(review.absent) && isNull(review.absenceCancelledAt);
  const visible = !review.removedAt && !review.hiddenAt && !review.gameHiddenAt && !held;
  if (!visible) {
    if (review.threadId) {
      await removePost(review.threadId);
      await saveThreadId({ serverId, reviewId, threadId: null });
    }
    return;
  }

  const { photos, ...post } = reviewForumPost({
    review,
    tagIds: forum ? await getForumTags(forumId) : new Map(),
    reviewsUrl: siteOrigin && `${siteOrigin}/${server.slug}/games/${review.gameId}/reviews`,
  });
  const input = { ...post, files: await fetchPhotoFiles(photos) };
  // 텍스트 채널엔 제목 칸이 없어 본문 첫 줄로 올린다.
  // ponytail: 길면 잘라서 스포일러 ||가 닫히지 않을 수 있다.
  const text = {
    channelId: forumId,
    content: `**${post.name}**\n${post.content}`.slice(0, MESSAGE_MAX_LENGTH),
    files: input.files,
  };
  const update = forum
    ? () => updateForumPost({ threadId: review.threadId ?? "", ...input })
    : () => updateFileMessage({ messageId: review.threadId ?? "", ...text });
  if (review.threadId && (await update())) return;
  // 고칠 수 없는 게시글(누가 지웠거나 첨부 수정이 막힘)은 지우고 새로 올린다.
  if (review.threadId) await removePost(review.threadId);
  const threadId = forum
    ? await createForumPost({ forumId, ...input })
    : await createFileMessage(text);
  await saveThreadId({ serverId, reviewId, threadId: threadId ?? null });
}
