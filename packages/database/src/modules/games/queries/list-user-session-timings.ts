import { and, eq, isNotNull, isNull, ne, or, sql } from "drizzle-orm";

import { db } from "#/client";
import type { MySessionTiming } from "#/modules/games/model/find-overlapping-game";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { games, participants } from "#/schema";

import { sessionEndAtSql } from "./session-end-at-sql";

// 신청 겹침 검사용: 시간이 정해졌고 아직 끝나지 않은 내 세션(GM이거나 확정·대기·추첨 신청 중). 같은 서버의 세션만 본다.
export async function listUserSessionTimings({
  transaction,
  serverId,
  userId,
  excludeGameId,
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  userId: string;
  excludeGameId: string;
  now?: Date;
}): Promise<MySessionTiming[]> {
  const rows = await (transaction ?? db)
    .selectDistinct({
      id: games.id,
      confirmedAt: games.confirmedAt,
      playMinutes: games.playMinutes,
      endedAt: games.endedAt,
    })
    .from(games)
    .leftJoin(
      participants,
      and(
        eq(participants.gameId, games.id),
        eq(participants.userId, userId),
        ne(participants.status, PARTICIPANT_STATUS.removed),
      ),
    )
    .where(
      and(
        eq(games.serverId, serverId),
        ne(games.id, excludeGameId),
        isNull(games.cancelledAt),
        isNotNull(games.confirmedAt),
        // 식 쪽에는 컬럼 타입이 없어 Date를 직렬화하지 못하므로 문자열로 넘긴다.
        sql`${sessionEndAtSql} > ${now.toISOString()}::timestamptz`,
        or(eq(games.gmId, userId), isNotNull(participants.userId)),
      ),
    );
  return rows.map((row) => ({ ...row, confirmedAt: row.confirmedAt! }));
}
