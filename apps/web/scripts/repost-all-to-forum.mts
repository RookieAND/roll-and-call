import { getGameForNotice, saveDiscordThreadId } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { findGameCategoryId, listRulebookCategories } from "@roll-and-call/database/rulebooks";
import { getServerBySlug } from "@roll-and-call/database/servers";
import {
  addForumTags,
  createForumMessagePost,
  deleteDiscordThread,
  getDiscordChannel,
  sendDiscordMessage,
  syncForumFollowUps,
  type DiscordEmbed,
} from "@roll-and-call/discord";
import {
  recruitForumPost,
  recruitPostTitle,
  recruitStatusTagIds,
  resolveRecruitTags,
} from "@roll-and-call/game-notices";

// 일회성: 포럼에 이미 옮긴 글을 지우고, 서버의 모든 구인을 만든 순서대로 새 포맷으로 다시 올린 뒤 옛 스레드 대화를 이어 붙인다.
// 실행: NEXT_PUBLIC_SITE_URL=... NODE_OPTIONS=--conditions=react-server pnpm dlx tsx scripts/repost-all-to-forum.mts --slug trpia --forum <id> --channel <옛 모집 채널> [--apply]
import { db } from "../../../packages/database/src/client";

const argument = (name: string) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
};
const apply = process.argv.includes("--apply");
const forumId = argument("forum")!;
const oldChannelId = argument("channel")!;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const token = process.env.DISCORD_BOT_TOKEN!;
if (!process.env.NEXT_PUBLIC_SITE_URL) throw new Error("NEXT_PUBLIC_SITE_URL이 필요합니다");

type Raw = {
  id: string;
  type: number;
  content: string;
  author: { id: string; username: string; global_name?: string | null; bot?: boolean };
  mentions: { id: string; username: string; global_name?: string | null }[];
  embeds: DiscordEmbed[];
  attachments: { filename: string }[];
  thread?: { id: string };
};

async function read<T>(path: string): Promise<T> {
  for (;;) {
    const response = await fetch(`https://discord.com/api/v10${path}`, {
      headers: { authorization: `Bot ${token}` },
    });
    if (response.status === 429) {
      await sleep(((await response.json()) as { retry_after: number }).retry_after * 1000 + 200);
      continue;
    }
    if (!response.ok) throw new Error(`${path} ${response.status} ${await response.text()}`);
    return (await response.json()) as T;
  }
}
async function readAll(channelId: string) {
  const messages: Raw[] = [];
  let before = "";
  for (;;) {
    const page = await read<Raw[]>(`/channels/${channelId}/messages?limit=100${before}`);
    messages.push(...page);
    if (page.length < 100) return messages;
    before = `&before=${page.at(-1)!.id}`;
  }
}
const snowflakeTime = (id: string) => Number(BigInt(id) >> 22n) + 1420070400000;
const timeLabel = (id: string) =>
  new Date(snowflakeTime(id)).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "short",
  });
const oldTitle = (message: Raw) =>
  (message.embeds[0]?.title ?? "").replace(/^[🎲🚫]\s*/u, "").replace(/\s*\(취소됨\)$/, "");
function plain(text: string, mentions: Raw["mentions"]) {
  return text
    .replace(/<@!?(\d+)>/g, (_, id: string) => {
      const user = mentions.find((candidate) => candidate.id === id);
      return `@${user?.global_name ?? user?.username ?? "사용자"}`;
    })
    .replace(/<@&\d+>/g, "@역할")
    .replace(/<#\d+>/g, "#채널");
}

const server = await getServerBySlug(argument("slug")!);
if (!server) throw new Error("server not found");
const games = await db.query.games.findMany({
  where: (game, { and, eq, isNull }) => and(eq(game.serverId, server.id), isNull(game.hiddenAt)),
  orderBy: (game, { asc }) => asc(game.createdAt),
});
const oldPosts = (await readAll(oldChannelId)).filter((message) => message.thread);
const claimed = new Set<string>();

// 1) 포럼에 이미 있는 이관 글 삭제
const stale: string[] = [];
for (const game of games) {
  if (!game.discordThreadId) continue;
  const thread = await getDiscordChannel(game.discordThreadId);
  if (thread?.parentId === forumId) stale.push(game.discordThreadId);
}
console.log(`지울 글 ${stale.length}건 / 올릴 구인 ${games.length}건`);

// 2) 태그: 쓰인 룰 분류 태그를 더 만들고 연결 값을 만든다
const categoryIds = new Map<string, string | null>();
for (const game of games) {
  categoryIds.set(game.id, await findGameCategoryId({ serverId: server.id, gameId: game.id }));
}
const categories = (await listRulebookCategories({ serverId: server.id })).filter((category) =>
  [...categoryIds.values()].includes(category.id),
);
const tagNames = ["모집중", "마감", ...categories.map((category) => category.name)];
let tagIdByName = new Map(tagNames.map((name) => [name.slice(0, 20), name.slice(0, 20)]));
if (apply) {
  const created = await addForumTags({ forumId, names: tagNames });
  if (!created) throw new Error("태그를 만들지 못했습니다");
  tagIdByName = created;
}
const savedMap = {
  open: tagIdByName.get("모집중"),
  closed: tagIdByName.get("마감"),
  categories: Object.fromEntries(
    categories.map((category) => [category.id, tagIdByName.get(category.name.slice(0, 20))!]),
  ),
};
console.log("forum_tags =", JSON.stringify(savedMap));
const target = {
  forum: true,
  tags: resolveRecruitTags({
    saved: savedMap,
    available: [...tagIdByName].map(([name, id]) => ({ id, name })),
  }),
};

if (apply) {
  for (const threadId of stale) {
    await deleteDiscordThread(threadId);
    await sleep(600);
  }
  console.log("기존 글 삭제 완료");
}

// 3) 만든 순서대로 올리고 대화를 바로 이어 붙인다(최근 활동순 정렬이 만든 순서와 같아지게)
const now = new Date();
let created = 0;
let copied = 0;
for (const row of games) {
  const game = await getGameForNotice({ serverId: server.id, gameId: row.id });
  if (!game) continue;
  const gmName = game.gm?.username ?? "?";
  const confirmedCount = countConfirmed(game.participants);
  const cancelled = Boolean(game.cancelledAt);
  const closed =
    cancelled ||
    Boolean(game.endedAt) ||
    confirmedCount >= game.maxPlayers ||
    (game.confirmedAt !== null && game.confirmedAt <= now) ||
    game.endDate < now;
  // 옛 스레드가 있던 구인만 옛 대화를 가진다(같은 제목의 다른 구인이 가져가지 않게).
  const candidates = oldPosts
    .filter(
      (post) =>
        row.discordThreadId !== null &&
        !claimed.has(post.id) &&
        oldTitle(post) === game.title.trim(),
    )
    .map((post) => ({ post, gap: Math.abs(snowflakeTime(post.id) - game.createdAt.getTime()) }))
    .sort((a, b) => a.gap - b.gap);
  const match = candidates[0];
  const oldPost =
    match && (candidates.length === 1 || match.gap <= 10 * 60 * 1000) ? match.post : undefined;
  if (oldPost) claimed.add(oldPost.id);
  const name = recruitPostTitle({ title: game.title, gmName, cancelled });
  console.log(
    `${apply ? "[올림]" : "[계획]"} ${name} · ${closed ? "마감" : "모집중"} · 옛 대화 ${oldPost ? "있음" : "없음"}`,
  );
  if (!apply) continue;

  const post = await recruitForumPost({ server, game, gmName, confirmedCount, cancelled });
  const threadId = await createForumMessagePost({
    forumId,
    name,
    appliedTags: recruitStatusTagIds({
      target,
      closed,
      categoryId: categoryIds.get(game.id) ?? null,
      kind: game.kind,
      playType: game.playType,
    }),
    input: post.input,
  });
  if (!threadId) {
    console.error(`  실패: ${game.id}`);
    continue;
  }
  await saveDiscordThreadId({ serverId: server.id, gameId: game.id, threadId });
  created += 1;
  await syncForumFollowUps({ threadId, chunks: post.followUps, buttons: post.followUpButtons });
  if (game.images.length > 0) {
    await sendDiscordMessage({
      channelId: threadId,
      input: { embeds: game.images.map((image) => ({ url: image, image: { url: image } })) },
    });
  }
  if (oldPost) {
    const thread = (await readAll(oldPost.thread!.id))
      .reverse()
      .filter((message) => message.type !== 21);
    for (const message of thread) {
      const label = `-# ${timeLabel(message.id)}`;
      const text = plain(message.content, message.mentions);
      const attachments = message.attachments.map((file) => `📎 ${file.filename}`).join("\n");
      const embeds = message.embeds.map((embed) =>
        JSON.parse(plain(JSON.stringify(embed), message.mentions)),
      ) as DiscordEmbed[];
      const body = message.author.bot
        ? [label, text].filter(Boolean).join("\n")
        : [
            `${label} · **${message.author.global_name ?? message.author.username}**`,
            text,
            attachments,
          ]
            .filter(Boolean)
            .join("\n");
      await sendDiscordMessage({
        channelId: threadId,
        input: { content: body.slice(0, 2000), embeds: embeds.length > 0 ? embeds : undefined },
      });
      copied += 1;
      await sleep(700);
    }
  }
  await sleep(1000);
}
console.log(apply ? `올림 ${created}건 · 복사한 메시지 ${copied}개` : "드라이런 끝");
process.exit(0);
