import "server-only";
import { games, participants } from "@trpg/database";
import { sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "@/shared/lib";

// ponytail: inner alias "p" + raw column, else RQB re-aliases participants.gameId to the outer games table → "games"."game_id" (does not exist).
// 정원은 확정 인원으로만 센다(대기자는 자리를 차지하지 않는다).
export const confirmedCountSql = sql`(select count(*) from ${participants} "p" where "p"."game_id" = ${games.id} and "p"."status" = ${PARTICIPANT_STATUS.confirmed})`;
