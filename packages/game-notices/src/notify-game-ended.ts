import type { Server } from "@roll-and-call/database";
import {
  claimEndNotice,
  getGameForNotice,
  listConfirmedDiscordIds,
} from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { getDiscordId } from "@roll-and-call/database/profiles";
import { DISCORD_COLOR, sendDiscordMessage } from "@roll-and-call/discord";
import { compact, uniq } from "es-toolkit";

import { gameNoticeEmbed } from "./game-notice-embed";
import { gameUrl } from "./game-url";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { messageText } from "./message-text";

// 끝난 세션의 스레드에 종료와 후기 작성을 알린다. 안내 권리를 먼저 가져가므로 마치기 직후 호출과 크론이 겹쳐도 한 번만 나간다.
// 확정 참여자가 없으면 후기를 받을 사람이 없어 올리지 않는다.
export async function notifyGameEnded({ server, gameId }: { server: Server; gameId: string }) {
  if (!(await claimEndNotice({ serverId: server.id, gameId, now: new Date() }))) return;
  const game = await getGameForNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId || countConfirmed(game.participants) === 0) return;

  const gmName = game.gm?.username ?? "?";
  const values = gameHeadValues({ server, game, gmName });
  const [gmDiscordId, playerDiscordIds] = await Promise.all([
    getDiscordId(game.gmId),
    listConfirmedDiscordIds({ serverId: server.id, gameId }),
  ]);
  const discordIds = uniq(compact([gmDiscordId, ...playerDiscordIds]));
  const detailUrl = gameUrl({ slug: server.slug, gameId: game.id });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      ...(await messageHeadInput({
        serverId: server.id,
        key: "end",
        values,
        userMentions: discordIds,
        after: discordIds.map((discordId) => `<@${discordId}>`).join(" "),
      })),
      embeds: [
        gameNoticeEmbed({
          slug: server.slug,
          game,
          gmName,
          emoji: "🏁",
          color: DISCORD_COLOR.complete,
          description: await messageText({ serverId: server.id, key: "end", values }),
        }),
      ],
      buttons: detailUrl ? [{ label: "✍ 후기 작성하기", url: `${detailUrl}/review` }] : [],
    },
  });
}
