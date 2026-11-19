import { sql, type SQL } from "drizzle-orm";

import { gameRounds, games } from "#db/schema";

// 읽기 이전(C36-3): 단발 구인의 시간·출석 칼럼을 games 대신 회차 1에서 읽는 식. 상관 서브쿼리라 어느 쿼리에도 조인 없이 쓴다.
// ponytail: 별칭 "fr"과 날 칼럼 이름. 관계형 쿼리(findMany)가 where 안의 칼럼 앞에 붙은 표 이름을 바깥 games 별칭으로 바꿔 쓰는 것을 피한다(confirmedCountSql과 같다).
// 표 하나만 읽는 select에서는 drizzle이 games.id를 표 이름 없이 "id"로 찍는다. 회차 표의 id에 묶이지 않도록
// 안쪽은 id가 없는 파생 표로 감싼다(Postgres가 펼쳐서 인덱스는 그대로 탄다).
const firstRoundColumn = (
  column: "start_at" | "planned_end_at" | "ended_at" | "attendance_confirmed_at",
) =>
  sql`(select ${sql.raw('"fr"."value"')} from (select ${sql.raw(`"game_id", "round_no", "${column}" as "value"`)} from ${gameRounds}) "fr" where ${sql.raw('"fr"."game_id"')} = ${games.id} and ${sql.raw('"fr"."round_no"')} = 1)`.mapWith(
    gameRounds.startAt,
  ) as unknown as SQL<Date | null>;

// 값이 비어 있으면 null이다. mapWith는 null을 디코더에 넘기지 않는다.
export const firstRoundStartSql = firstRoundColumn("start_at");

export const firstRoundEndedAtSql = firstRoundColumn("ended_at");

export const firstRoundPlannedEndSql = firstRoundColumn("planned_end_at");

export const firstRoundAttendanceConfirmedAtSql = firstRoundColumn("attendance_confirmed_at");
