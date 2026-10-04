import { and, eq, isNull, type SQL } from "drizzle-orm";

import { games } from "#/schema";

import { hiddenGmWhere } from "./hidden-gm-where";

// 취소된 구인은 지난 기록 화면에 흐린 카드로만 남긴다(D286). 건수·집계 쿼리는 includeCancelled를 켜지 않는다.
export function publicGamesWhere(
  serverId: string,
  { includeCancelled = false }: { includeCancelled?: boolean } = {},
) {
  const conditions: SQL[] = [eq(games.serverId, serverId), isNull(games.hiddenAt), hiddenGmWhere];
  if (!includeCancelled) conditions.push(isNull(games.cancelledAt));
  return and(...conditions)!;
}
