import type { Game } from "@roll-and-call/database";
import { type Server } from "@roll-and-call/database";
import { getMemberNickname } from "@roll-and-call/database/profiles";
import {
  sendDiscordMessage,
  editDiscordMessage,
  renameDiscordThread,
  DISCORD_COLOR,
} from "@roll-and-call/discord";

import { cancelDescription } from "./cancel-description";
import { gameNoticeEmbed } from "./game-notice-embed";
import { recruitEmbed } from "./recruit-embed";

// GM 삭제는 지우기 전에 받아둔 행으로, 운영진·자동 취소는 취소한 행으로 부른다. 모집 공지는 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled({ server, game }: { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const gmName = (await getMemberNickname({ serverId: server.id, userId: game.gmId })) ?? "?";

  await Promise.all([
    editDiscordMessage({
      channelId: server.recruitChannelId,
      messageId: game.discordThreadId,
      input: {
        embeds: [
          recruitEmbed({ slug: server.slug, game, gmName, confirmedCount: 0, cancelled: true }),
        ],
        buttons: [],
      },
    }),
    sendDiscordMessage({
      channelId: game.discordThreadId,
      input: {
        embeds: [
          gameNoticeEmbed({
            slug: server.slug,
            game,
            gmName,
            emoji: "🚫",
            color: DISCORD_COLOR.cancelled,
            description: cancelDescription(game.cancelKind),
            linked: false,
          }),
        ],
      },
    }),
    renameDiscordThread({ threadId: game.discordThreadId, name: `${game.title} (취소됨)` }),
  ]);
}
