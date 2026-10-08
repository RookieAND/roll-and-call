import { getGameForNotice, saveDiscordThreadId } from "@roll-and-call/database/games";
import { countConfirmed } from "@roll-and-call/database/games/model";
import { findGameCategoryId, listRulebookCategories } from "@roll-and-call/database/rulebooks";
import { getServerBySlug } from "@roll-and-call/database/servers";
import {
  addForumTags,
  createForumMessagePost,
  getDiscordChannel,
  sendDiscordMessage,
} from "@roll-and-call/discord";
import {
  recruitButtons,
  recruitEmbed,
  recruitStatusTagIds,
  resolveRecruitTags,
} from "@roll-and-call/game-notices";

// 일회성: 모집 채널의 기존 구인 글을 새 포럼 게시글로 다시 만든다. --apply 없이는 아무것도 보내지 않는다.
// 실행: node --env-file=.env.local --import tsx scripts/migrate-recruit-to-forum.mts --slug trpia --forum <id> [--apply]
import { db } from "../../../packages/database/src/client";

const argument = (name: string) => process.argv[process.argv.indexOf(`--${name}`) + 1];
const slug = argument("slug");
const forumId = argument("forum");
const apply = process.argv.includes("--apply");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const server = await getServerBySlug(slug);
if (!server) throw new Error(`server ${slug} not found`);
const rows = await db.query.games.findMany({
  where: (game, { and, eq, isNotNull, isNull }) =>
    and(eq(game.serverId, server.id), isNotNull(game.discordThreadId), isNull(game.hiddenAt)),
  orderBy: (game, { asc }) => asc(game.createdAt),
});
const categoryIds = new Map<string, string | null>();
for (const row of rows) {
  categoryIds.set(row.id, await findGameCategoryId({ serverId: server.id, gameId: row.id }));
}
const categories = await listRulebookCategories({ serverId: server.id });
const usedCategories = categories.filter((category) =>
  [...categoryIds.values()].includes(category.id),
);

// 포럼에 모집중·마감과 쓰인 룰 분류 태그를 만들고(없는 것만) 서버 설정에 연결할 값을 출력한다(서버 설정에는 따로 저장). 드라이런은 만들지 않고 이름만 보여 준다.
const tagNames = ["모집중", "마감", ...usedCategories.map((category) => category.name)];
console.log(`태그: ${tagNames.join(", ")}`);
let tagIdByName = new Map(tagNames.map((name) => [name.slice(0, 20), name.slice(0, 20)]));
if (apply) {
  const created = await addForumTags({ forumId, names: tagNames });
  if (!created) throw new Error("태그를 만들지 못했습니다(봇의 채널 관리 권한 확인)");
  tagIdByName = created;
  const idOf = (name: string) => created.get(name.slice(0, 20));
  console.log(
    "forum_tags =",
    JSON.stringify({
      open: idOf("모집중"),
      closed: idOf("마감"),
      categories: Object.fromEntries(
        usedCategories.map((category) => [category.id, idOf(category.name)!]),
      ),
    }),
  );
}
const target = {
  forum: true,
  tags: resolveRecruitTags({
    saved: {
      open: tagIdByName.get("모집중"),
      closed: tagIdByName.get("마감"),
      categories: Object.fromEntries(
        usedCategories.map((category) => [
          category.id,
          tagIdByName.get(category.name.slice(0, 20))!,
        ]),
      ),
    },
    available: [...tagIdByName].map(([name, id]) => ({ id, name })),
  }),
};
const nameById = new Map([...tagIdByName].map(([name, id]) => [id, name]));

const now = new Date();
let done = 0;
for (const row of rows) {
  const threadChannel = await getDiscordChannel(row.discordThreadId!);
  if (threadChannel && threadChannel.parentId === forumId) continue;
  const game = await getGameForNotice({ serverId: server.id, gameId: row.id });
  if (!game) continue;
  const confirmedCount = countConfirmed(game.participants);
  const closed =
    Boolean(game.cancelledAt || game.endedAt) ||
    confirmedCount >= game.maxPlayers ||
    (game.confirmedAt !== null && game.confirmedAt <= now) ||
    game.endDate < now;
  const categoryId = categoryIds.get(game.id) ?? null;
  const tagIds = recruitStatusTagIds({
    target,
    closed,
    categoryId,
    kind: game.kind,
    playType: game.playType,
  });
  const name = game.cancelledAt ? `${game.title} (취소됨)` : game.title;
  console.log(
    `${apply ? "[이관]" : "[계획]"} ${name} · ${closed ? "마감" : "모집중"} · 태그 ${tagIds.map((id) => nameById.get(id)).join(", ")}`,
  );
  if (!apply) continue;

  const threadId = await createForumMessagePost({
    forumId,
    name,
    appliedTags: tagIds,
    input: {
      embeds: [
        recruitEmbed({
          slug: server.slug,
          game,
          gmName: game.gm?.username ?? "?",
          confirmedCount,
          cancelled: Boolean(game.cancelledAt),
        }),
      ],
      buttons: game.cancelledAt ? [] : recruitButtons({ slug: server.slug, gameId: game.id }),
    },
  });
  if (!threadId) {
    console.error(`  실패: ${game.id}`);
    continue;
  }
  if (game.images.length > 0) {
    await sendDiscordMessage({
      channelId: threadId,
      input: { embeds: game.images.map((image) => ({ url: image, image: { url: image } })) },
    });
  }
  await saveDiscordThreadId({ serverId: server.id, gameId: game.id, threadId });
  done += 1;
  await sleep(1500);
}
console.log(apply ? `이관 ${done}건 완료` : `계획 ${rows.length}건(이미 옮긴 글 제외 전)`);
process.exit(0);
