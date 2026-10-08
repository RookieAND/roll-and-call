import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";
import { memberName } from "./member-name";
import { memberNoticeLine } from "./member-notice-line";
import { gameHeadValues, messageHeadInput } from "./message-head-input";
import { messageText } from "./message-text";

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
  const [game, name] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    memberName({ serverId: server.id, userId }),
  ]);
  if (!game?.discordThreadId) return;

  const gmName = game.gm?.username ?? "?";
  const textKey = leftTextKey({ leftServer, removedByGm });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🚪",
    color: DISCORD_COLOR.left,
    description: await messageText({
      serverId: server.id,
      key: textKey,
      values: { ...gameHeadValues({ server, game, gmName }), 참여자: name },
    }),
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "leave",
        values: gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
        ...(await memberNoticeLine({
          serverId: server.id,
          userIds: [userId],
          key: `${textKey}_line`,
          values: gameHeadValues({ server, game, gmName }),
        })),
      })),
    },
  });
}

function leftTextKey({ leftServer, removedByGm }: { leftServer: boolean; removedByGm: boolean }) {
  if (leftServer) return "leave_server";
  return removedByGm ? "leave_gm" : "leave";
}
