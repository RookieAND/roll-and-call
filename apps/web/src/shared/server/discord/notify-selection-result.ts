import { type Server } from "@roll-and-call/database";
import { getGameForDrawNotice } from "@roll-and-call/database/games";
import { compareWaitlistOrder, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { gameNoticeEmbed, gameUrl } from "@roll-and-call/game-notices";

// 선발 마치기가 커밋된 뒤 부른다. 확정자 멘션은 임베드가 아니라 메시지 본문에 따로 찍는다(D390 방향, 임시 처리).
// 시스템이 붙이는 줄이라 서버별 문구 설정을 거치지 않는다.
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

  const detailUrl = gameUrl({ slug: server.slug, gameId: game.id });
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    url: detailUrl,
    emoji: "✅",
    color: DISCORD_COLOR.complete,
    description: `선발이 끝났어요. 신청한 ${confirmed.length + waiting.length}명 중 ${confirmed.length}명이 확정됐어요.\n자리가 나면 GM이 대기 명단에서 확정해요.`,
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
      ...(discordIds.length > 0 && {
        content: `${discordIds.map((discordId) => `<@${discordId}>`).join(", ")}님이 확정되었어요.`,
        userMentions: discordIds,
      }),
      buttons: detailUrl ? [{ label: "구인글 보기", url: detailUrl }] : [],
    },
  });
}
