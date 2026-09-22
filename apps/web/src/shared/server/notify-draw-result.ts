import { db } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { gameUrl } from "./game-url";

// GM이 추첨 결과를 적용한 뒤에 부른다. 링크는 각자 자기 값을 보는 결과 페이지로 보낸다.
// 떨어진 사람도 알아야 다른 판을 잡으므로 확정·대기를 한 글에 같이 적는다.
export async function notifyDrawResult(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (gameRow, { eq }) => eq(gameRow.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: {
        columns: { status: true, drawRank: true },
        with: { user: { columns: { username: true } } },
      },
    },
  });
  if (!game?.discordThreadId) return;

  const byRank = game.participants.toSorted(
    (left, right) => (left.drawRank ?? 0) - (right.drawRank ?? 0),
  );
  const nameOf = (rank: number, username: string) => `${rank}. ${username}`;
  const confirmed = byRank
    .filter((participant) => participant.status === "confirmed")
    .map((participant, index) => nameOf(index + 1, participant.user?.username ?? "?"));
  const waiting = byRank
    .filter((participant) => participant.status === "waiting")
    .map((participant, index) => nameOf(index + 1, participant.user?.username ?? "?"));

  const detailUrl = gameUrl(game.id);
  const embed = gameNoticeEmbed({
    game,
    gmName: game.gm?.username ?? "?",
    url: detailUrl && `${detailUrl}/draw`,
    emoji: "🎲",
    color: DISCORD_COLOR.complete,
    description: `추첨이 끝났어요. 신청한 ${byRank.length}명 중 ${confirmed.length}명이 확정됐어요.\n자리가 나면 대기 순번대로 확정됩니다. 내 1d100 값은 링크에서 확인하세요.`,
    fields: [
      // Discord field value 상한 1024자
      { name: `✅ 확정 ${confirmed.length}명`, value: confirmed.join("\n").slice(0, 1024) || "-" },
      { name: `⏳ 대기 ${waiting.length}명`, value: waiting.join("\n").slice(0, 1024) || "-" },
    ],
  });

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
