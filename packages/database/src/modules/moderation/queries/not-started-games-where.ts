import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { games } from "../../../schema";

// 아직 시작하지 않은 구인: 세션 일시가 없거나(조율 중) 그 일시가 지나지 않았다. 추방이 손대는 범위다.
export function notStartedGamesWhere(serverId: string) {
  return and(
    eq(games.serverId, serverId),
    or(isNull(games.confirmedAt), gt(games.confirmedAt, sql`now()`)),
  );
}
