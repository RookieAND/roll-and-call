import "server-only";
import { games } from "@trpg/database";
import { and, eq, gt, ilike, isNull, lte, not, or, sql, type SQL } from "drizzle-orm";

import { GAME_STATUS_FILTER, type GamesFilter } from "@/shared/api";

import { confirmedCountSql } from "./confirmed-count-sql";

// 상태 필터는 모집 상태 배지(deriveGameStatus)와 같은 기준이다.
// 플레이가 끝난 게임은 빼되, "전체"를 고른 사람에게는 지난 것까지 보여준다.
export function recruitingGamesWhere(filter: GamesFilter, now: Date) {
  const conditions: SQL[] = [];
  if (filter.q) {
    conditions.push(or(ilike(games.title, `%${filter.q}%`), ilike(games.rule, `%${filter.q}%`))!);
  }
  if (filter.status !== GAME_STATUS_FILTER.all) {
    conditions.push(or(isNull(games.confirmedAt), gt(games.confirmedAt, now))!);
  }

  const full = sql`${confirmedCountSql} >= ${games.maxPlayers}`;
  const open = gt(games.endDate, now);
  switch (filter.status) {
    case undefined:
      conditions.push(open);
      break;
    case GAME_STATUS_FILTER.recruiting:
      conditions.push(open, not(full));
      break;
    case GAME_STATUS_FILTER.waitlist:
      conditions.push(open, full, eq(games.waitlistEnabled, true));
      break;
    case GAME_STATUS_FILTER.closed:
      conditions.push(or(lte(games.endDate, now), and(full, eq(games.waitlistEnabled, false)))!);
      break;
    case GAME_STATUS_FILTER.all:
      break;
  }
  return and(...conditions);
}
