import { sql } from "drizzle-orm";

import { games } from "#db/schema";

import { confirmedCountSql } from "./confirmed-count-sql";
import { firstRoundStartSql } from "./first-round-sql";
import { sessionEndAtSql } from "./session-end-at-sql";

// 목록 탭·칩의 기준. 모집 상태 배지(deriveGameStatus)와 같고, 세션이 끝난 글은 종료로 뺀다.
export function gameBucketSql({ now }: { now: Date }) {
  const at = sql`${now.toISOString()}::timestamptz`;
  const full = sql`${confirmedCountSql} >= ${games.maxPlayers}`;
  // 다회차는 1회차가 끝나도 끝난 글이 아니라서, 모든 회차가 끝나 구인이 마쳐진 뒤(finished_at)에만 종료로 뺀다.
  const ended = sql`(case when ${games.roundCount} > 1 then ${games.finishedAt} is not null and ${games.finishedAt} <= ${at} else ${firstRoundStartSql} is not null and ${sessionEndAtSql} <= ${at} end)`;
  const scheduled = sql`(${games.scheduleMode} = 'coordinate' and ${firstRoundStartSql} is not null)`;
  const live = sql`(${games.endDate} > ${at} and not ${ended} and not ${scheduled} and (not ${full} or ${games.waitlistEnabled}))`;
  // 취소된 구인은 취소한 날에 끝난 것으로 본다.
  const finishedAt = sql`coalesce(${games.cancelledAt}, case when ${games.roundCount} > 1 then ${games.finishedAt} else ${sessionEndAtSql} end, ${games.endDate})`;
  return { full, ended, live, finishedAt };
}
