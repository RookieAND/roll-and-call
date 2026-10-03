import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { getUsername } from "@roll-and-call/database/profiles";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";
import { leftNoticeText } from "./left-notice-text";

// 삭제 후에 불러야 현재 인원이 맞다. leftServer는 디스코드 서버를 나가 자동으로 빠진 경우다.
export async function notifyGameLeft({
  server,
  gameId,
  userId,
  removedByGm,
  leftServer = false,
}: {
  server: Server;
  gameId: string;
  userId: string;
  removedByGm: boolean;
  leftServer?: boolean;
}) {
  const [game, username] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    getUsername(userId),
  ]);
  if (!game?.discordThreadId) return;

  const name = username ?? "?";
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🚪",
    color: DISCORD_COLOR.left,
    description: leftNoticeText({ name, removedByGm, leftServer }),
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
