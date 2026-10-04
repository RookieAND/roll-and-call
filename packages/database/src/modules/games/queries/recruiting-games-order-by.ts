import { asc, desc, sql, type SQL } from "drizzle-orm";

import { GAME_SORT, GAME_TAB, type GamesFilter } from "#/modules/games/model/games-filter";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { games } from "#/schema";

import { confirmedCountSql } from "./confirmed-count-sql";
import { gameBucketSql } from "./game-bucket-sql";

// 남은 자리순에서 추첨 구인(확정 0명)은 맨 뒤에 둔다(R10).
export function recruitingGamesOrderBy({ filter, now }: { filter: GamesFilter; now: Date }): SQL[] {
  const latest = desc(games.createdAt);
  if (filter.tab === GAME_TAB.past) return [desc(gameBucketSql({ now }).finishedAt), latest];
  if (filter.sort === GAME_SORT.deadline) return [asc(games.endDate), latest];
  if (filter.sort === GAME_SORT.slots) {
    return [
      asc(sql`${games.recruitMethod} = ${RECRUIT_METHOD.lottery}`),
      desc(sql`${games.maxPlayers} - ${confirmedCountSql}`),
      latest,
    ];
  }
  return [latest];
}
