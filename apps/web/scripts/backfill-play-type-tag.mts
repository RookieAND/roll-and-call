import { getServerBySlug } from "@roll-and-call/database/servers";
import { setForumPostTags } from "@roll-and-call/discord";
import { loadRecruitTarget } from "@roll-and-call/game-notices";

// 일회성: 열려 있는 기존 구인 게시글에 플레이 유형 태그(마이그레이션 뒤 모두 보이스)를 붙인다. --apply 없이는 아무것도 보내지 않는다.
// 이미 붙은 글과 잠긴 글은 건드리지 않아서 중간에 멈춰도 다시 실행하면 이어진다.
// 실행: node --env-file=.env.local --import tsx scripts/backfill-play-type-tag.mts --slug trpia [--apply]
import { db } from "../../../packages/database/src/client";

const slug = process.argv[process.argv.indexOf("--slug") + 1];
const apply = process.argv.includes("--apply");
const REQUEST_GAP_MS = 1500;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const server = await getServerBySlug(slug);
if (!server) throw new Error(`server ${slug} not found`);
const target = await loadRecruitTarget(server);
if (!target.forum) throw new Error("모집 채널이 포럼이 아닙니다");
if (!target.tags.playTypes.voice && !target.tags.playTypes.text) {
  throw new Error("어드민에서 플레이 유형 태그를 먼저 연결해 주세요");
}

const rows = await db.query.games.findMany({
  where: (game, { and, eq, isNotNull, isNull }) =>
    and(
      eq(game.serverId, server.id),
      isNotNull(game.discordThreadId),
      isNull(game.cancelledAt),
      isNull(game.endedAt),
    ),
  orderBy: (game, { asc }) => asc(game.createdAt),
});

const playTypeTagIds = Object.values(target.tags.playTypes).flatMap((id) => id ?? []);
let done = 0;
for (const game of rows) {
  const tagId = target.tags.playTypes[game.playType];
  if (!tagId) continue;
  console.log(`${apply ? "[붙임]" : "[계획]"} ${game.title} · ${game.playType}`);
  if (!apply) continue;
  await setForumPostTags({
    threadId: game.discordThreadId!,
    managedTagIds: playTypeTagIds,
    tagIds: [tagId],
    skipLocked: true,
  });
  done += 1;
  await sleep(REQUEST_GAP_MS);
}
console.log(apply ? `${done}건 처리` : `계획 ${rows.length}건`);
process.exit(0);
