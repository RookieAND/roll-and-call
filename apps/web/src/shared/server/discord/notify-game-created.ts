import type { Game } from "@roll-and-call/database";
import type { Server } from "@roll-and-call/database";
import { findGameCategoryId } from "@roll-and-call/database/rulebooks";
import { createForumMessagePost, syncForumFollowUps } from "@roll-and-call/discord";
import {
  loadRecruitTarget,
  recruitForumPost,
  recruitPostTitle,
  recruitStatusTagIds,
} from "@roll-and-call/game-notices";

import { sendGameImages } from "./send-game-images";

// 반환값은 포럼 게시글 id(= 스레드 id = 첫 메시지 id, 실패 시 undefined).
// 모집 채널은 포럼만 지원한다. 포럼이 아니거나 비어 있으면 올리지 않는다.
export async function notifyGameCreated({
  server,
  game,
  gmName,
  confirmedCount,
}: {
  server: Server;
  game: Game;
  gmName: string;
  confirmedCount: number;
}): Promise<string | undefined> {
  const [target, categoryId] = await Promise.all([
    loadRecruitTarget(server),
    findGameCategoryId({ serverId: server.id, gameId: game.id }),
  ]);
  if (!target || !server.recruitChannelId) {
    console.warn("Recruit channel is not a forum; skipping recruit post", { serverId: server.id });
    return undefined;
  }
  const post = await recruitForumPost({ server, game, gmName, confirmedCount });
  const threadId = await createForumMessagePost({
    forumId: server.recruitChannelId,
    name: recruitPostTitle({ title: game.title, gmName }),
    appliedTags: recruitStatusTagIds({
      target,
      closed: confirmedCount >= game.maxPlayers,
      categoryId,
      kind: game.kind,
      playType: game.playType,
    }),
    input: post.input,
  });
  if (!threadId) return undefined;
  await syncForumFollowUps({
    threadId,
    chunks: post.followUps,
    buttons: post.followUpButtons,
  });
  await sendGameImages({ slug: server.slug, game, threadId });
  return threadId;
}
