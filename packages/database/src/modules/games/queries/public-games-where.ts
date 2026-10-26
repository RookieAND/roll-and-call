import { and, eq, isNotNull, isNull, lte, or, sql, type SQL } from "drizzle-orm";

import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { games } from "#db/schema";

import { hiddenGmWhere } from "./hidden-gm-where";
import { sessionEndAtSql } from "./session-end-at-sql";

// 비공개 구인은 목록·검색·홈에 나오지 않는다. 지난 구인 탭만 endedPrivateAt을 넘겨, 그 시각까지 끝난 비공개 구인을 함께 보인다.
// 취소된 구인은 지난 기록 화면에 흐린 카드로만 남긴다(D286). 건수·집계 쿼리는 includeCancelled를 켜지 않는다.
export function publicGamesWhere(
  serverId: string,
  {
    includeCancelled = false,
    endedPrivateAt,
  }: { includeCancelled?: boolean; endedPrivateAt?: Date } = {},
) {
  const isPublic = eq(games.visibility, GAME_VISIBILITY.public);
  const visible = endedPrivateAt
    ? or(
        isPublic,
        and(
          isNotNull(games.confirmedAt),
          lte(sessionEndAtSql, sql`${endedPrivateAt.toISOString()}::timestamptz`),
        ),
      )!
    : isPublic;
  const conditions: SQL[] = [
    eq(games.serverId, serverId),
    isNull(games.hiddenAt),
    hiddenGmWhere,
    visible,
  ];
  if (!includeCancelled) conditions.push(isNull(games.cancelledAt));
  return and(...conditions)!;
}
