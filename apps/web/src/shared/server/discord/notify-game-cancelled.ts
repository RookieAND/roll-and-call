import type { Game } from "@roll-and-call/database";
import { type Server } from "@roll-and-call/database";
import { getUsername } from "@roll-and-call/database/profiles";
import {
  sendDiscordMessage,
  editDiscordMessage,
  renameDiscordThread,
  DISCORD_COLOR,
} from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { recruitEmbed } from "./recruit-embed";

// 삭제 전에 받아둔 행으로 부른다. 모집 공지는 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled({ server, game }: { server: Server; game: Game }) {
  if (!game.discordThreadId) return;

  const gmName = (await getUsername(game.gmId)) ?? "?";

  await Promise.all([
    editDiscordMessage({
      channelId: server.recruitChannelId,
      messageId: game.discordThreadId,
      input: {
        embeds: [recruitEmbed({ game, gmName, confirmedCount: 0, cancelled: true })],
        buttons: [],
      },
    }),
    sendDiscordMessage({
      channelId: game.discordThreadId,
      input: {
        embeds: [
          gameNoticeEmbed({
            game,
            gmName,
            emoji: "🚫",
            color: DISCORD_COLOR.cancelled,
            description: `GM이 세션을 취소했어요.\n신청은 모두 사라졌고, 다시 열리면 새 공지로 올라옵니다.`,
            linked: false,
          }),
        ],
      },
    }),
    renameDiscordThread({ threadId: game.discordThreadId, name: `${game.title} (취소됨)` }),
  ]);
}
