import { getServerBySlug } from "@roll-and-call/database/servers";
import { getDiscordChannel } from "@roll-and-call/discord";
import { attachRecruitThumbnail, defaultBannerUrl } from "@roll-and-call/game-notices";

// 일회성: 포럼 모집 글 하나의 첫 메시지에 썸네일(없으면 기본 다크 배너)을 첨부한다.
// 실행: NEXT_PUBLIC_SITE_URL=... DATABASE_URL=... DISCORD_BOT_TOKEN=... NODE_OPTIONS=--conditions=react-server pnpm dlx tsx scripts/attach-thread-thumbnail.mts --slug trpia --thread 1558497604642541668 [--apply]
import { db } from "../../../packages/database/src/client";

const argument = (name: string) => {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
};
const apply = process.argv.includes("--apply");
const slug = argument("slug");
const threadId = argument("thread");
if (!slug || !threadId) throw new Error("--slug 와 --thread 가 필요합니다");

const server = await getServerBySlug(slug);
if (!server) throw new Error("server not found");
const game = await db.query.games.findFirst({
  where: (row, { and, eq }) => and(eq(row.serverId, server.id), eq(row.discordThreadId, threadId)),
});
if (!game) throw new Error("그 서버에서 이 스레드에 연결된 구인을 찾지 못했습니다");

const thread = await getDiscordChannel(threadId);
const source = game.thumbnailUrl ?? defaultBannerUrl();
console.log(
  `${apply ? "[첨부]" : "[계획]"} ${game.title} · 스레드 ${thread?.name ?? "?"} · ${
    game.thumbnailUrl ? (game.thumbnailSpoiler ? "스포일러 썸네일" : "썸네일") : "기본 배너"
  } · ${source ?? "이미지 주소 없음(NEXT_PUBLIC_SITE_URL 확인)"}`,
);
if (apply && source) await attachRecruitThumbnail({ game, threadId });
process.exit(0);
