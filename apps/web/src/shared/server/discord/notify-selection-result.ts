import { type Server } from "@roll-and-call/database";
import { getGameForDrawNotice } from "@roll-and-call/database/games";
import { compareWaitlistOrder, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { DEFAULT_SELECTION_HEAD } from "@roll-and-call/database/servers";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import {
  gameHeadValues,
  gameNoticeEmbed,
  gameUrl,
  messageHeadInput,
  messageText,
} from "@roll-and-call/game-notices";

// 선발 마치기가 커밋된 뒤 부른다. 머리 줄은 「추첨 결과」 설정을 나눠 쓰고(저장 전에는 선발용 기본 문구), 확정자 멘션은 본문 줄에 찍는다.
export async function notifySelectionResult({
  server,
  gameId,
}: {
  server: Server;
  gameId: string;
}) {
  const game = await getGameForDrawNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId) return;

  const confirmed = game.participants.filter(
    (participant) => participant.status === PARTICIPANT_STATUS.confirmed,
  );
  const waiting = game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.waiting)
    .toSorted(compareWaitlistOrder);
  const listOf = (rows: typeof confirmed) =>
    rows.map((participant, index) => `${index + 1}. ${participant.user?.username ?? "?"}`);

  const headValues = gameHeadValues({ server, game, gmName: game.gm?.username ?? "?" });
  const detailUrl = gameUrl({ slug: server.slug, gameId: game.id });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    url: detailUrl,
    emoji: "✅",
    color: DISCORD_COLOR.complete,
    description: `${await messageText({
      serverId: server.id,
      key: "selection",
      values: {
        ...headValues,
        "신청 수": String(confirmed.length + waiting.length),
        "확정 수": String(confirmed.length),
      },
    })}\n자리가 나면 GM이 대기 명단에서 확정해요.`,
    fields: [
      {
        name: `✅ 확정 ${confirmed.length}명`,
        value: listOf(confirmed).join("\n").slice(0, 1024) || "-",
      },
      {
        name: `⏳ 대기 ${waiting.length}명`,
        value: listOf(waiting).join("\n").slice(0, 1024) || "-",
      },
    ],
  });

  const discordIds = confirmed.flatMap((participant) => participant.user?.discordId ?? []);
  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "draw",
        values: headValues,
        defaultHead: DEFAULT_SELECTION_HEAD,
        ...(discordIds.length > 0 && {
          userMentions: discordIds,
          after: await messageText({
            serverId: server.id,
            key: "selection_line",
            values: {
              ...headValues,
              확정자: discordIds.map((discordId) => `<@${discordId}>`).join(", "),
            },
          }),
        }),
      })),
      buttons: detailUrl ? [{ label: "구인글 보기", url: detailUrl }] : [],
    },
  });
}
