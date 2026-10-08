import type { Game } from "@roll-and-call/database";
import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { getMemberNickname } from "@roll-and-call/database/profiles";
import { findGameCategoryId } from "@roll-and-call/database/rulebooks";
import {
  sendDiscordMessage,
  editDiscordMessage,
  renameDiscordThread,
  syncForumFollowUps,
  DISCORD_COLOR,
} from "@roll-and-call/discord";

import { cancelReasonLine, cancelTextKey } from "./cancel-description";
import { gameNoticeEmbed } from "./game-notice-embed";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { messageText } from "./message-text";
import { recruitEmbed } from "./recruit-embed";
import { recruitForumPost } from "./recruit-forum-post";
import { recruitPostTitle } from "./recruit-post-title";
import { loadRecruitTarget, recruitMessageChannelId } from "./recruit-target";
import { syncRecruitStatusTag } from "./sync-recruit-status-tag";

// 취소한 행으로 부른다. 모집 공지는 취소한 때 인원 그대로 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled({ server, game }: { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const [nickname, withRoster, target, categoryId] = await Promise.all([
    getMemberNickname({ serverId: server.id, userId: game.gmId }),
    getGameForNotice({ serverId: server.id, gameId: game.id }),
    loadRecruitTarget(server),
    findGameCategoryId({ serverId: server.id, gameId: game.id }),
  ]);
  const gmName = nickname ?? "?";
  const confirmedCount = countConfirmed(withRoster?.participants ?? []);

  const threadId = game.discordThreadId;
  const updateRecruitMessage = async () => {
    if (!target.forum) {
      await editDiscordMessage({
        channelId: recruitMessageChannelId({ server, target, threadId }),
        messageId: threadId,
        input: {
          embeds: [
            recruitEmbed({ slug: server.slug, game, gmName, confirmedCount, cancelled: true }),
          ],
          buttons: [],
        },
      });
      return;
    }
    const post = await recruitForumPost({
      server,
      game,
      gmName,
      confirmedCount,
      cancelled: true,
    });
    await editDiscordMessage({ channelId: threadId, messageId: threadId, input: post.input });
    await syncForumFollowUps({
      threadId,
      chunks: post.followUps,
      buttons: post.followUpButtons,
    });
  };

  await Promise.all([
    updateRecruitMessage(),
    sendDiscordMessage({
      channelId: game.discordThreadId,
      input: {
        ...(await messageHeadInput({
          serverId: server.id,
          key: "cancel",
          values: gameHeadValues({ server, game, gmName }),
        })),
        embeds: [
          gameNoticeEmbed({
            slug: server.slug,
            game,
            gmName,
            emoji: "🚫",
            color: DISCORD_COLOR.cancelled,
            description:
              (await messageText({
                serverId: server.id,
                key: cancelTextKey(game.cancelKind),
                values: gameHeadValues({ server, game, gmName }),
              })) + cancelReasonLine({ kind: game.cancelKind, reason: game.cancelReason }),
            linked: false,
          }),
        ],
      },
    }),
    renameDiscordThread({
      threadId: game.discordThreadId,
      name: target.forum
        ? recruitPostTitle({ title: game.title, gmName, cancelled: true })
        : `${game.title} (취소됨)`,
    }),
    syncRecruitStatusTag({
      target,
      threadId: game.discordThreadId,
      closed: true,
      cancelled: true,
      categoryId,
      kind: game.kind,
      playType: game.playType,
    }),
  ]);
}
