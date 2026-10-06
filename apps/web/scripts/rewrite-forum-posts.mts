import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { getServerBySlug } from "@roll-and-call/database/servers";
import {
  editDiscordMessage,
  getDiscordChannel,
  renameDiscordThread,
  syncForumFollowUps,
} from "@roll-and-call/discord";
import { recruitForumPost, recruitPostTitle } from "@roll-and-call/game-notices";

// 일회성: 포럼으로 옮긴 모집 글의 제목·첫 메시지(평문 본문+버튼)를 새 포맷으로 다시 쓴다.
// 실행: NEXT_PUBLIC_SITE_URL=... NODE_OPTIONS=--conditions=react-server pnpm dlx tsx scripts/rewrite-forum-posts.mts --slug trpia [--limit n] [--apply]
import { db } from "../../../packages/database/src/client";

const argument = (name: string) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
};
const apply = process.argv.includes("--apply");
const limit = Number(argument("limit") ?? Infinity);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

if (!process.env.NEXT_PUBLIC_SITE_URL)
  throw new Error("NEXT_PUBLIC_SITE_URL이 필요합니다(버튼 주소)");
const server = await getServerBySlug(argument("slug")!);
if (!server) throw new Error("server not found");
const rows = await db.query.games.findMany({
  where: (game, { and, eq, isNotNull }) =>
    and(eq(game.serverId, server.id), isNotNull(game.discordThreadId)),
  orderBy: (game, { asc }) => asc(game.createdAt),
});

let count = 0;
for (const row of rows) {
  if (count >= limit) break;
  const threadId = row.discordThreadId!;
  const thread = await getDiscordChannel(threadId);
  if (!thread?.parentId || thread.parentId !== argument("forum")) continue;
  const game = await getGameForNotice({ serverId: server.id, gameId: row.id });
  if (!game) continue;
  const gmName = game.gm?.username ?? "?";
  const cancelled = Boolean(game.cancelledAt);
  const post = await recruitForumPost({
    server,
    game,
    gmName,
    confirmedCount: countConfirmed(game.participants),
    cancelled,
  });
  const name = recruitPostTitle({ title: game.title, gmName, cancelled });
  console.log(
    `${apply ? "[재작성]" : "[계획]"} ${name} · 본문 ${post.input.content?.length}자 · 이어붙임 ${post.followUps.length} · 버튼 ${post.input.buttons?.length}`,
  );
  count += 1;
  if (!apply) continue;
  await renameDiscordThread({ threadId, name });
  await editDiscordMessage({ channelId: threadId, messageId: threadId, input: post.input });
  await syncForumFollowUps({ threadId, chunks: post.followUps });
  await sleep(1200);
}
console.log(`${count}건`);
process.exit(0);
