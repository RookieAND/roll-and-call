import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameHeadValues, messageHeadInput } from "../lib/message-head-input";
import { messageText } from "../lib/message-text";
import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";
import { memberName } from "./member-name";
import { memberNoticeLine } from "./member-notice-line";

// 바꾼 뒤에 불러야 현재 인원이 맞다.
export async function notifyMovedToWaitlist({
  server,
  gameId,
  userId,
}: {
  server: Server;
  gameId: string;
  userId: string;
}) {
  const [game, name] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    memberName({ serverId: server.id, userId }),
  ]);
  if (!game?.discordThreadId) return;

  const values = gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" });
  const line = await memberNoticeLine({
    serverId: server.id,
    userIds: [userId],
    key: "moved_waiting_line",
    values,
  });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "⏳",
    color: DISCORD_COLOR.waiting,
    description: line.after
      ? undefined
      : await messageText({
          serverId: server.id,
          key: "moved_waiting",
          values: { ...values, 참여자: name },
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
        values,
        ...line,
      })),
    },
  });
}
