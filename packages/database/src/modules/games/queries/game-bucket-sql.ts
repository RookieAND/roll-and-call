import { sql } from "drizzle-orm";

import { games } from "#/schema";

import { confirmedCountSql } from "./confirmed-count-sql";
import { sessionEndAtSql } from "./session-end-at-sql";

// 목록 탭·칩의 기준. 모집 상태 배지(deriveGameStatus)와 같고, 세션이 끝난 글은 종료로 뺀다.
export function gameBucketSql({ now }: { now: Date }) {
  const at = sql`${now.toISOString()}::timestamptz`;
  const full = sql`${confirmedCountSql} >= ${games.maxPlayers}`;
  const ended = sql`(${games.confirmedAt} is not null and ${sessionEndAtSql} <= ${at})`;
  const scheduled = sql`(${games.scheduleMode} = 'coordinate' and ${games.confirmedAt} is not null)`;
  const live = sql`(${games.endDate} > ${at} and not ${ended} and not ${scheduled} and (not ${full} or ${games.waitlistEnabled}))`;
  const finishedAt = sql`coalesce(${sessionEndAtSql}, ${games.endDate})`;
  return { full, ended, live, finishedAt };
}
