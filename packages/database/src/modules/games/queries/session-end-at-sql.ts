import { sql } from "drizzle-orm";

import { firstRoundEndedAtSql, firstRoundPlannedEndSql } from "./first-round-sql";

// sessionEndAt의 SQL판. 회차 1의 실제 종료 시각, 없으면 예정 종료(시작 + 플레이타임)다.
export const sessionEndAtSql = sql`coalesce(${firstRoundEndedAtSql}, ${firstRoundPlannedEndSql})`;
