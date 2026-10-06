// 일회성: 옛 모집 채널 스레드의 대화를 이관한 포럼 게시글 안에 그대로 이어 붙인다. 멘션은 모두 글자로 바꿔 알림이 가지 않게 한다.
// 실행: NODE_OPTIONS=--conditions=react-server pnpm dlx tsx scripts/copy-threads-to-forum.mts --slug trpia --channel <옛 모집 채널> [--apply]
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { getServerBySlug } from "@roll-and-call/database/servers";
import { sendDiscordMessage, type DiscordEmbed } from "@roll-and-call/discord";

import { db } from "../../../packages/database/src/client";

const argument = (name: string) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
};
const apply = process.argv.includes("--apply");
const oldChannelId = argument("channel")!;
const progressPath = argument("progress") ?? "/tmp/copy-threads-progress.json";
const done = new Set<string>(
  existsSync(progressPath) ? JSON.parse(readFileSync(progressPath, "utf8")) : [],
);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const token = process.env.DISCORD_BOT_TOKEN!;

type Raw = {
  id: string;
  type: number;
  content: string;
  author: { id: string; username: string; global_name?: string | null; bot?: boolean };
  mentions: { id: string; username: string; global_name?: string | null }[];
  embeds: (DiscordEmbed & { image?: { url: string } })[];
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
const gameTitle = (message: Raw) =>
  (message.embeds[0]?.title ?? "").replace(/^[🎲🚫]\s*/u, "").replace(/\s*\(취소됨\)$/, "");

// 알림이 가지 않게 멘션을 글자로 바꾼다(역할·채널 포함).
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
  where: (game, { and, eq, isNotNull }) =>
    and(eq(game.serverId, server.id), isNotNull(game.discordThreadId)),
  orderBy: (game, { asc }) => asc(game.createdAt),
});
const oldPosts = (await readAll(oldChannelId)).filter((message) => message.thread);
const claimed = new Set<string>();

for (const game of games) {
  if (done.has(game.id)) continue;
  const candidates = oldPosts
    .filter((post) => !claimed.has(post.id) && gameTitle(post) === game.title.trim())
    .map((post) => ({ post, gap: Math.abs(snowflakeTime(post.id) - game.createdAt.getTime()) }))
    .sort((a, b) => a.gap - b.gap);
  const match = candidates[0];
  if (!match || (candidates.length > 1 && match.gap > 10 * 60 * 1000)) {
    console.warn(`[건너뜀] ${game.title}: 옛 스레드를 찾지 못했습니다`);
    continue;
  }
  claimed.add(match.post.id);
  const thread = (await readAll(match.post.thread!.id))
    .reverse()
    .filter((message) => message.type !== 21);
  console.log(
    `${apply ? "[복사]" : "[계획]"} ${game.title} · 옛 스레드 ${match.post.thread!.id} → 새 글 ${game.discordThreadId} · 메시지 ${thread.length}개`,
  );
  if (!apply) continue;

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
      channelId: game.discordThreadId,
      input: { content: body.slice(0, 2000), embeds: embeds.length > 0 ? embeds : undefined },
    });
    await sleep(700);
  }
  done.add(game.id);
  writeFileSync(progressPath, JSON.stringify([...done]));
}
console.log(apply ? "복사 완료" : "드라이런 끝");
process.exit(0);
