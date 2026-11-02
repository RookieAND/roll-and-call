import { db } from "#db/client";
import { type GamesFilter } from "#db/modules/games/model/games-filter";
import { memberNicknameSql } from "#db/modules/profiles";
import { games } from "#db/schema";

import { recruitingGamesOrderBy } from "./recruiting-games-order-by";
import { recruitingGamesWhere } from "./recruiting-games-where";

export const GAMES_PAGE_SIZE = 9;

// 데스크톱은 두 탭 모두 "더 보기"로 늘려 page n이면 처음부터 n쪽 분량을 준다. 모바일 진행 중 탭은 그중 마지막 쪽만 보인다.
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
      limit: current * pageSize,
      offset: 0,
    }),
    db.$count(games, where),
  ]);
  return { rows, total, pageSize };
}
