import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { DISCORD_COLOR, sendDiscordMessage } from "@roll-and-call/discord";

import { gameUrl } from "../lib/game-url";
import { gameHeadValues, messageHeadInput } from "../lib/message-head-input";
import { gameNoticeEmbed } from "./game-notice-embed";

// GM이 회차의 가능 시간 모으기를 열었을 때 구인 스레드에 올리는 요청 안내. 조율표 링크 버튼을 붙인다.
export async function notifyRoundAvailability({
  server,
  gameId,
  roundNo,
}: {
  server: Server;
  gameId: string;
  roundNo: number;
}) {
  const game = await getGameForNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId || game.visibility !== "public") return;
  const gmName = game.gm?.username ?? "?";
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: "📢",
    color: DISCORD_COLOR.recruit,
    description: `${roundNo}회차 가능 시간을 알려 주세요.`,
  });
  const base = gameUrl({ slug: server.slug, gameId });
  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      buttons: base ? [{ label: "가능 시간 입력", url: `${base}/schedule?round=${roundNo}` }] : [],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "round_availability",
        values: gameHeadValues({ server, game, gmName }),
      })),
    },
  });
}
