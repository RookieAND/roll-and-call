import { sql } from "drizzle-orm";

import { DEFAULT_PLAY_MINUTES } from "#/modules/games/model/session-timing";
import { games } from "#/schema";

// sessionEndAt의 SQL판. 실제 종료 시각, 없으면 시작 + 플레이타임이다.
export const sessionEndAtSql = sql`coalesce(${games.endedAt}, ${games.confirmedAt} + coalesce(${games.playMinutes}, ${DEFAULT_PLAY_MINUTES}) * interval '1 minute')`;
