import { type Server } from "@roll-and-call/database";
import { getGameForDrawNotice } from "@roll-and-call/database/games";
import { compareWaitlistOrder, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";
import { gameUrl } from "@roll-and-call/game-notices";
import { gameNoticeEmbed } from "@roll-and-call/game-notices";

// 추첨 명령이 커밋된 뒤 부른다(GM 버튼, 마감 크론 모두). 링크는 각자 자기 값을 보는 결과 페이지로 보낸다.
// 떨어진 사람도 알아야 다른 판을 잡으므로 확정·대기를 한 글에 같이 적는다.
export async function notifyDrawResult({ server, gameId }: { server: Server; gameId: string }) {
  const game = await getGameForDrawNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId) return;

  const byRank = game.participants.toSorted(
    (left, right) => (left.drawRank ?? 0) - (right.drawRank ?? 0),
  );
  const nameOf = (rank: number, username: string) => `${rank}. ${username}`;
  const confirmed = byRank
    .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .map((participant, index) => nameOf(index + 1, participant.user?.username ?? "?"));
  const waiting = game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.waiting)
    .toSorted(compareWaitlistOrder)
    .map((participant, index) => nameOf(index + 1, participant.user?.username ?? "?"));

  const detailUrl = gameUrl({ slug: server.slug, gameId: game.id });
  const drawUrl = detailUrl && `${detailUrl}/draw`;
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    url: drawUrl,
    emoji: "🎲",
    color: DISCORD_COLOR.complete,
    description: `추첨이 끝났어요. 신청한 ${byRank.length}명 중 ${confirmed.length}명이 확정됐어요.\n자리가 나면 GM이 대기 명단에서 확정해요. 내 1d100 값은 링크에서 확인하세요.`,
    fields: [
      // Discord field value 상한 1024자
      { name: `✅ 확정 ${confirmed.length}명`, value: confirmed.join("\n").slice(0, 1024) || "-" },
      { name: `⏳ 대기 ${waiting.length}명`, value: waiting.join("\n").slice(0, 1024) || "-" },
    ],
  });

  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      buttons: drawUrl ? [{ label: "🎲 추첨 결과 보기", url: drawUrl }] : [],
    },
  });
}
