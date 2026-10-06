import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { findGameCategoryId } from "@roll-and-call/database/rulebooks";
import {
  editDiscordMessage,
  renameDiscordThread,
  syncForumFollowUps,
} from "@roll-and-call/discord";

import { recruitButtons } from "./recruit-buttons";
import { recruitEmbed } from "./recruit-embed";
import { recruitForumPost } from "./recruit-forum-post";
import { recruitPostTitle } from "./recruit-post-title";
import { loadRecruitTarget, recruitMessageChannelId } from "./recruit-target";
import { syncRecruitStatusTag } from "./sync-recruit-status-tag";

export async function refreshRecruitPost({ server, gameId }: { server: Server; gameId: string }) {
  const game = await getGameForNotice({ serverId: server.id, gameId });
  // 취소한 구인의 공지는 notifyGameCancelled가 남긴 모양 그대로 둔다.
  if (!game?.discordThreadId || game.cancelledAt) return;
  const threadId = game.discordThreadId;

  const [target, categoryId] = await Promise.all([
    loadRecruitTarget(server),
    findGameCategoryId({ serverId: server.id, gameId }),
  ]);
  const confirmedCount = countConfirmed(game.participants);
  const gmName = game.gm?.username ?? "?";

  const updateMessage = async () => {
    if (!target.forum) {
      await editDiscordMessage({
        channelId: recruitMessageChannelId({ server, target, threadId }),
        messageId: threadId,
        input: {
          embeds: [recruitEmbed({ slug: server.slug, game, gmName, confirmedCount })],
          buttons: recruitButtons({ slug: server.slug, gameId: game.id }),
        },
      });
      return;
    }
    const post = await recruitForumPost({ server, game, gmName, confirmedCount });
    await editDiscordMessage({ channelId: threadId, messageId: threadId, input: post.input });
    await syncForumFollowUps({
      threadId,
      chunks: post.followUps,
      buttons: post.followUpButtons,
    });
  };

  await Promise.all([
    updateMessage(),
    renameDiscordThread({
      threadId,
      name: target.forum ? recruitPostTitle({ title: game.title, gmName }) : game.title,
    }),
    syncRecruitStatusTag({
      target,
      threadId,
      closed: confirmedCount >= game.maxPlayers,
      categoryId,
    }),
  ]);
}
