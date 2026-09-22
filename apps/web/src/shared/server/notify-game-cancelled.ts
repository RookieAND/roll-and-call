import { db, type Game } from "@trpg/database";
import {
  sendDiscordMessage,
  editDiscordMessage,
  renameDiscordThread,
  DISCORD_COLOR,
} from "@trpg/discord";

import { discordChannelId } from "./discord-channel-id";
import { gameNoticeEmbed } from "./game-notice-embed";
import { recruitEmbed } from "./recruit-embed";

// 삭제 전에 받아둔 행으로 부른다. 모집 공지는 빨갛게 고쳐 남기고, 스레드에는 취소를 알린다.
export async function notifyGameCancelled(game: Game) {
  if (!game.discordThreadId) return;

  const gm = await db.query.profiles.findFirst({
    where: (profile, { eq }) => eq(profile.id, game.gmId),
    columns: { username: true },
  });
  const gmName = gm?.username ?? "?";

  await Promise.all([
    editDiscordMessage(discordChannelId("recruit"), game.discordThreadId, {
      embeds: [recruitEmbed(game, gmName, 0, true)],
      buttons: [],
    }),
    sendDiscordMessage(game.discordThreadId, {
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
    }),
    renameDiscordThread(game.discordThreadId, `${game.title} (취소됨)`),
  ]);
}
