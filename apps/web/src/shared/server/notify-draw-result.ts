import { db } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";
import type { DiscordEmbed } from "@trpg/discord";

import { gameUrl } from "./game-url";

// 추첨이 끝난 뒤에 부른다. 떨어진 사람도 알아야 다른 판을 잡으므로 확정·대기를 한 글에 같이 적는다.
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

  const embed: DiscordEmbed = {
    title: `🎲 ${game.title} — 추첨 결과`,
    url: gameUrl(game.id),
    description: `신청한 ${byRank.length}명 중 ${confirmed.length}명을 무작위로 뽑았어요.\n자리가 나면 대기 순번대로 확정됩니다.`,
    color: DISCORD_COLOR.complete,
    fields: [
      // Discord field value 상한 1024자
      { name: `✅ 확정 ${confirmed.length}명`, value: confirmed.join("\n").slice(0, 1024) || "-" },
      { name: `⏳ 대기 ${waiting.length}명`, value: waiting.join("\n").slice(0, 1024) || "-" },
    ],
    footer: { text: `GM ${game.gm?.username ?? "?"}` },
    timestamp: new Date().toISOString(),
  };

  await sendDiscordMessage(game.discordThreadId, { embeds: [embed] });
}
