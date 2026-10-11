import { type Server } from "@roll-and-call/database";
import { getGameForDrawNotice } from "@roll-and-call/database/games";
import { PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { DEFAULT_DRAW_SKIPPED_HEAD } from "@roll-and-call/database/servers";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";

// 신청자가 뽑을 인원 이하라 추첨 없이 전원 확정된 글(D331)의 구인 스레드 공지. 굴림이 없어 결과 페이지 링크와 1d100 안내는 없다.
// 알림은 이번에 확정된 사람에게만 울린다. 이미 확정돼 있던 사람은 명단에만 적는다.
export async function notifyDrawSkipped({
  server,
  gameId,
  confirmedUserIds,
}: {
  server: Server;
  gameId: string;
  confirmedUserIds: string[];
}) {
  const game = await getGameForDrawNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId) return;

  const confirmed = game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .toSorted((left, right) => (left.joinedAt?.getTime() ?? 0) - (right.joinedAt?.getTime() ?? 0));
  const names = confirmed.map(
    (participant, index) => `${index + 1}. ${participant.user?.username ?? "?"}`,
  );
  const newDiscordIds = confirmed
    .filter((participant) => confirmedUserIds.includes(participant.userId))
    .flatMap((participant) => participant.user?.discordId ?? []);

  const gmName = game.gm?.username ?? "?";
  const headValues = gameHeadValues({ server, game, gmName });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: "✅",
    color: DISCORD_COLOR.confirmed,
    description: await messageText({
      serverId: server.id,
      key: "draw_skipped",
      values: { ...headValues, "신청 수": String(confirmedUserIds.length) },
    }),
    fields: [
      // Discord field value 상한 1024자
      { name: `✅ 확정 ${names.length}명`, value: names.join("\n").slice(0, 1024) || "-" },
    ],
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "draw",
        values: headValues,
        defaultHead: DEFAULT_DRAW_SKIPPED_HEAD,
        ...(newDiscordIds.length > 0 && {
          userMentions: newDiscordIds,
          after: await messageText({
            serverId: server.id,
            key: "draw_skipped_line",
            values: {
              ...headValues,
              확정자: newDiscordIds.map((discordId) => `<@${discordId}>`).join(", "),
            },
          }),
        }),
      })),
    },
  });
}
