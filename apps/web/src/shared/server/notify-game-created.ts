import type { Game } from "@trpg/database";
import { sendDiscordMessage, startDiscordThread } from "@trpg/discord";

import { discordChannelId } from "./discord-channel-id";
import { recruitEmbed } from "./recruit-embed";
import { sendGameImages } from "./send-game-images";

// 반환값은 스레드 id(= 공지 메시지 id, 실패 시 undefined).
export async function notifyGameCreated(
  game: Game,
  gmName: string,
  confirmedCount: number,
): Promise<string | undefined> {
  const message = await sendDiscordMessage(discordChannelId("recruit"), {
    content: "📢 새로운 구인 글이 올라왔어요!",
    embeds: [recruitEmbed(game, gmName, confirmedCount)],
  });
  const threadId = message && (await startDiscordThread(message, game.title));
  if (threadId) await sendGameImages(game, threadId);
  return threadId;
}
