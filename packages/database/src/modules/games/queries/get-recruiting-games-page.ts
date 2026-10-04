import { db } from "#/client";
import { GAME_TAB, type GamesFilter } from "#/modules/games/model/games-filter";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games } from "#/schema";

import { recruitingGamesOrderBy } from "./recruiting-games-order-by";
import { recruitingGamesWhere } from "./recruiting-games-where";

export const GAMES_PAGE_SIZE = 12;

// 지난 구인은 페이지를 넘기지 않고 "더 보기"로 늘린다: page n이면 처음부터 n쪽 분량.
// total은 목록과 같은 조건이라 지난 구인 [전체]에서는 취소된 카드까지 센다. 「더 보기」·쪽 번호에만 쓰고 화면 건수로 보이지 않는다.
export async function getRecruitingGamesPage({
  serverId,
  page,
  filter,
  pageSize = GAMES_PAGE_SIZE,
}: {
  serverId: string;
  page: number;
  filter: GamesFilter;
  pageSize?: number;
}) {
  const now = new Date();
  const where = recruitingGamesWhere({ serverId, filter, now });
  const current = Math.max(1, page);
  const grows = filter.tab === GAME_TAB.past;
  const [rows, total] = await Promise.all([
    db.query.games.findMany({
      where,
      orderBy: recruitingGamesOrderBy({ filter, now }),
      with: {
        gm: { columns: { avatarUrl: true }, extras: { username: memberNicknameSql(serverId) } },
        participants: {
          columns: { userId: true, status: true },
          where: (participant, { eq }) => eq(participant.serverId, serverId),
        },
      },
      limit: grows ? current * pageSize : pageSize,
      offset: grows ? 0 : (current - 1) * pageSize,
    }),
    db.$count(games, where),
  ]);
  return { rows, total, pageSize };
}
