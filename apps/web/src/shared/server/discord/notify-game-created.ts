import type { Game } from "@roll-and-call/database";
import type { Server } from "@roll-and-call/database";
import { sendDiscordMessage, startDiscordThread } from "@roll-and-call/discord";
import { gameHeadValues, messageHeadInput, recruitButtons } from "@roll-and-call/game-notices";
import { recruitEmbed } from "@roll-and-call/game-notices";

import { sendGameImages } from "./send-game-images";

// 반환값은 스레드 id(= 공지 메시지 id, 실패 시 undefined).
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
  const threadId = message && (await startDiscordThread({ message, name: game.title }));
  if (threadId) await sendGameImages({ slug: server.slug, game, threadId });
  return threadId;
}
