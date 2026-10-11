import type { Server } from "@roll-and-call/database";
import type { getGameForRecruitmentNotice } from "@roll-and-call/database/games";
import { countWaiting, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { DISCORD_COLOR, type DiscordEmbed } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";
import { formatGameSchedule } from "./lib/format-game-schedule";
import { gameHeadValues } from "./message-head-input";
import { messageText } from "./message-text";

export type RecruitmentNoticeGame = NonNullable<
  Awaited<ReturnType<typeof getGameForRecruitmentNotice>>
>;

export function recruitmentCompletePlayers(game: RecruitmentNoticeGame) {
  return game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .map((participant) => ({
      username: participant.user?.username ?? "?",
      discordId: participant.user?.discordId ?? null,
    }));
}

// 구인 완료 공지의 임베드. 처음 보낼 때와 명단이 바뀌어 고칠 때 같은 모양으로 지금 명단을 그린다.
export async function recruitmentCompleteEmbed({
  server,
  game,
}: {
  server: Server;
  game: RecruitmentNoticeGame;
}): Promise<DiscordEmbed> {
  const players = recruitmentCompletePlayers(game);
  const playerNames = players.map((player) => `**${player.username}**`);

  return gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🎉",
    color: DISCORD_COLOR.complete,
    description: await messageText({
      serverId: server.id,
      key: "done",
      values: gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" }),
    }),
    fields: [
      { name: "📜 룰", value: game.rule, inline: true },
      ...headcountFields({
        game,
        confirmedCount: players.length,
        waitingCount: countWaiting(game.participants),
      }),
      { name: "🕒 시간", value: formatGameSchedule(game), inline: false },
      // Discord field value 상한 1024자
      { name: "🙋 참여자", value: playerNames.join(", ").slice(0, 1024) || "-", inline: false },
    ],
  });
}
