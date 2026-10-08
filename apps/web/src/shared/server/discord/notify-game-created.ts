import type { Game } from "@roll-and-call/database";
import type { Server } from "@roll-and-call/database";
import { findGameCategoryId } from "@roll-and-call/database/rulebooks";
import {
  createForumMessagePost,
  sendDiscordMessage,
  startDiscordThread,
  syncForumFollowUps,
} from "@roll-and-call/discord";
import {
  gameHeadValues,
  loadRecruitTarget,
  messageHeadInput,
  recruitForumPost,
  recruitPostTitle,
  recruitStatusTagIds,
} from "@roll-and-call/game-notices";
import { recruitButtons, recruitEmbed } from "@roll-and-call/game-notices";

import { sendGameImages } from "./send-game-images";

// 반환값은 스레드 id(= 공지 메시지 id, 실패 시 undefined).
// 모집 채널이 포럼이면 게시글을, 텍스트 채널이면 메시지와 스레드를 만든다.
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
  let threadId: string | undefined;
  if (target.forum && server.recruitChannelId) {
    const post = await recruitForumPost({ server, game, gmName, confirmedCount });
    threadId = await createForumMessagePost({
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
    if (threadId) {
      await syncForumFollowUps({
        threadId,
        chunks: post.followUps,
        buttons: post.followUpButtons,
      });
    }
  } else {
    const message = await sendDiscordMessage({
      channelId: server.recruitChannelId,
      input: {
        ...(await messageHeadInput({
          serverId: server.id,
          key: "open",
          values: gameHeadValues({ server, game, gmName }),
        })),
        embeds: [recruitEmbed({ slug: server.slug, game, gmName, confirmedCount })],
        buttons: recruitButtons({ slug: server.slug, gameId: game.id }),
      },
    });
    threadId = message && (await startDiscordThread({ message, name: game.title }));
  }
  if (threadId) await sendGameImages({ slug: server.slug, game, threadId, forum: target.forum });
  return threadId;
}
