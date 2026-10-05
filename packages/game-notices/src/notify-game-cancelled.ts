import type { Game } from "@roll-and-call/database";
import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { getMemberNickname } from "@roll-and-call/database/profiles";
import {
  sendDiscordMessage,
  editDiscordMessage,
  renameDiscordThread,
  DISCORD_COLOR,
} from "@roll-and-call/discord";

import { cancelDescription } from "./cancel-description";
import { gameNoticeEmbed } from "./game-notice-embed";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { recruitEmbed } from "./recruit-embed";

// 취소한 행으로 부른다. 모집 공지는 취소한 때 인원 그대로 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled({ server, game }: { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const [nickname, withRoster] = await Promise.all([
    getMemberNickname({ serverId: server.id, userId: game.gmId }),
    getGameForNotice({ serverId: server.id, gameId: game.id }),
  ]);
  const gmName = nickname ?? "?";
  const confirmedCount = countConfirmed(withRoster?.participants ?? []);

  await Promise.all([
    editDiscordMessage({
      channelId: server.recruitChannelId,
      messageId: game.discordThreadId,
      input: {
        embeds: [
          recruitEmbed({ slug: server.slug, game, gmName, confirmedCount, cancelled: true }),
        ],
        buttons: [],
      },
    }),
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
            description: cancelDescription({ kind: game.cancelKind, reason: game.cancelReason }),
            linked: false,
          }),
        ],
      },
    }),
    renameDiscordThread({ threadId: game.discordThreadId, name: `${game.title} (취소됨)` }),
  ]);
}
