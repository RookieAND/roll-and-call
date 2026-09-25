import "server-only";
import { games } from "@roll-and-call/database";
import { sql } from "drizzle-orm";

import { DEFAULT_PLAY_MINUTES } from "@/shared/lib";

import { confirmedCountSql } from "./confirmed-count-sql";

// 목록 탭·칩의 기준. 모집 상태 배지(deriveGameStatus)와 같고, 세션이 끝난 글은 종료로 뺀다.
export function gameBucketSql({ now }: { now: Date }) {
  const at = sql`${now.toISOString()}::timestamptz`;
  const full = sql`${confirmedCountSql} >= ${games.maxPlayers}`;
  const sessionEndsAt = sql`${games.confirmedAt} + coalesce(${games.playMinutes}, ${DEFAULT_PLAY_MINUTES}) * interval '1 minute'`;
  const ended = sql`(${games.confirmedAt} is not null and ${sessionEndsAt} <= ${at})`;
  const scheduled = sql`(${games.scheduleMode} = 'coordinate' and ${games.confirmedAt} is not null)`;
  const live = sql`(${games.endDate} > ${at} and not ${ended} and not ${scheduled} and (not ${full} or ${games.waitlistEnabled}))`;
  // 지난 구인은 끝난 날짜순: 세션이 있으면 세션 끝, 없으면 모집 마감일.
  const finishedAt = sql`coalesce(${sessionEndsAt}, ${games.endDate})`;
  return { full, ended, live, finishedAt };
}
