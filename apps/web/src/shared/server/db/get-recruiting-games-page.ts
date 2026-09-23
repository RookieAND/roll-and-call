import "server-only";
import { db, games } from "@roll-and-call/database";

import { GAME_TAB, type GamesFilter } from "@/shared/api";

import { recruitingGamesOrderBy } from "./recruiting-games-order-by";
import { recruitingGamesWhere } from "./recruiting-games-where";

export const GAMES_PAGE_SIZE = 12;

// 지난 구인은 페이지를 넘기지 않고 "더 보기"로 늘린다: page n이면 처음부터 n쪽 분량.
export async function getRecruitingGamesPage({
  page,
  filter,
  pageSize = GAMES_PAGE_SIZE,
}: {
  page: number;
  filter: GamesFilter;
  pageSize?: number;
}) {
  const now = new Date();
  const where = recruitingGamesWhere({ filter, now });
  const current = Math.max(1, page);
  const grows = filter.tab === GAME_TAB.past;
  const [rows, total] = await Promise.all([
    db.query.games.findMany({
      where,
      orderBy: recruitingGamesOrderBy({ filter, now }),
      with: {
        gm: { columns: { username: true, avatarUrl: true } },
        participants: { columns: { userId: true, status: true } },
      },
      limit: grows ? current * pageSize : pageSize,
      offset: grows ? 0 : (current - 1) * pageSize,
    }),
    db.$count(games, where),
  ]);
  return { rows, total, pageSize };
}
