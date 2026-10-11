import type { Server } from "@roll-and-call/database";
import { saveCompletionMessageId } from "@roll-and-call/database/games";
import { deleteDiscordMessage, sendDiscordMessage } from "@roll-and-call/discord";
import {
  gameHeadValues,
  messageHeadInput,
  recruitmentCompleteEmbed,
  recruitmentCompletePlayers,
  type RecruitmentNoticeGame,
} from "@roll-and-call/game-notices";
import { isString } from "es-toolkit";

// 구인 완료 공지를 처음 보낸다. 보낸 메시지 id를 저장해 두면 이후 명단 변경은 이 메시지를 고친다.
export async function notifyRecruitmentComplete({
  server,
  game,
}: {
  server: Server;
  game: RecruitmentNoticeGame;
}) {
  const players = recruitmentCompletePlayers(game);
  const gmName = game.gm?.username ?? "?";
  const gmDiscordId = game.gm?.discordId ?? null;
  const playerMentions = players.map((player) =>
    player.discordId ? `<@${player.discordId}>` : `**${player.username}**`,
  );

  const message = await sendDiscordMessage({
    channelId: server.closedChannelId,
    input: {
      embeds: [await recruitmentCompleteEmbed({ server, game })],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "done",
        values: {
          ...gameHeadValues({ server, game, gmName }),
          "GM 멘션": gmDiscordId ? `<@${gmDiscordId}>` : `**${gmName}**`,
          "참여자 멘션": playerMentions.join(" "),
        },
        userMentions: [gmDiscordId, ...players.map((player) => player.discordId)].filter(isString),
      })),
    },
  });
  if (!message) return;

  // 동시에 둘이 보냈다면 먼저 저장한 쪽만 남기고 나머지는 지운다.
  const saved = await saveCompletionMessageId({
    serverId: server.id,
    gameId: game.id,
    messageId: message.id,
  });
  if (!saved) await deleteDiscordMessage({ channelId: message.channel_id, messageId: message.id });
}
