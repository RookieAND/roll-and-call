import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { games } from "../../../schema";

// 아직 시작하지 않은 구인: 세션 일시가 없거나(조율 중) 그 일시가 지나지 않았다. 추방·탈퇴가 손대는 범위다. 취소한 구인은 명단을 그대로 남겨 빼고 본다.
export function notStartedGamesWhere(serverId: string) {
  return and(
    eq(games.serverId, serverId),
    isNull(games.cancelledAt),
    or(isNull(games.confirmedAt), gt(games.confirmedAt, sql`now()`)),
  );
}
