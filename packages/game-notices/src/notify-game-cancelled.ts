import type { Game } from "@roll-and-call/database";
import { type Server } from "@roll-and-call/database";
import { getGameForNotice, listParticipantDiscordIds } from "@roll-and-call/database/games";
import { GAME_CANCEL_KIND, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { getDiscordId, getMemberNickname } from "@roll-and-call/database/profiles";
import { findGameCategoryId, findGameCategoryLabel } from "@roll-and-call/database/rulebooks";
import {
  sendDiscordMessage,
  editDiscordMessage,
  syncForumFollowUps,
  DISCORD_COLOR,
} from "@roll-and-call/discord";
import { compact } from "es-toolkit";

import { cancelReasonField, cancelTextKey } from "./cancel-description";
import { gameNoticeEmbed } from "./game-notice-embed";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { messageText } from "./message-text";
import { recruitForumPost } from "./recruit-forum-post";
import { recruitPostTitle } from "./recruit-post-title";
import { loadRecruitTarget } from "./recruit-target";
import { syncRecruitThread } from "./sync-recruit-thread";

// 취소한 행으로 부른다. 모집 공지는 취소한 때 인원 그대로 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled({ server, game }: { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const [nickname, withRoster, target, categoryId, ruleLabel, participantIds, gmDiscordId] =
    await Promise.all([
      getMemberNickname({ serverId: server.id, userId: game.gmId }),
      getGameForNotice({ serverId: server.id, gameId: game.id }),
      loadRecruitTarget(server),
      findGameCategoryId({ serverId: server.id, gameId: game.id }),
      findGameCategoryLabel({ serverId: server.id, gameId: game.id }),
      listParticipantDiscordIds({
        serverId: server.id,
        gameId: game.id,
        statuses: [PARTICIPANT_STATUS.confirmed, PARTICIPANT_STATUS.waiting],
      }),
      getDiscordId(game.gmId),
    ]);
  // 취소는 확정·대기 참여자 모두가 알아야 한다. GM이 직접 취소했으면 GM에게는 알리지 않는다.
  const alsoMention = [
    ...(game.cancelKind === GAME_CANCEL_KIND.gm ? [] : [gmDiscordId]),
    ...participantIds,
  ].map((id) => ({ id }));
  const gmName = nickname ?? "?";
  const confirmedCount = countConfirmed(withRoster?.participants ?? []);

  const threadId = game.discordThreadId;
  const updateRecruitMessage = async () => {
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
          alsoMention,
        })),
        embeds: [
          gameNoticeEmbed({
            slug: server.slug,
            game,
            gmName,
            emoji: "🚫",
            color: DISCORD_COLOR.cancelled,
            description: await messageText({
              serverId: server.id,
              key: cancelTextKey(game.cancelKind),
              values: gameHeadValues({ server, game, gmName }),
            }),
            fields: compact([
              cancelReasonField({ kind: game.cancelKind, reason: game.cancelReason }),
            ]),
            linked: false,
          }),
        ],
      },
    }),
    target &&
      syncRecruitThread({
        target,
        threadId: game.discordThreadId,
        name: recruitPostTitle({ title: game.title, gmName, ruleLabel, cancelled: true }),
        closed: true,
        cancelled: true,
        categoryId,
        kind: game.kind,
        playType: game.playType,
      }),
  ]);
}
