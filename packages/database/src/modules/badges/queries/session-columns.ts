import { sql } from "drizzle-orm";

import {
  firstRoundAttendanceConfirmedAtSql,
  firstRoundEndedAtSql,
  firstRoundStartSql,
} from "#db/modules/games/queries/first-round-sql";
import { games, homebrewRules, participants, rulebookCategories, rulebooks } from "#db/schema";

// attendedWhere와 같은 조건. 참여 쿼리가 participants를 이미 조인하므로 별칭으로 센다.
export const attendedCount = sql<number>`(
  select count(*)::int from ${participants} as attendee
  where attendee.game_id = ${games.id}
    and attendee.status = 'confirmed'
    and (attendee.absent = false or attendee.absence_cancelled_at is not null)
)`;

// 다회차 구인의 완주자 수(GM 제외). isFinisher와 같은 조건이다.
export const finisherCount = sql<number>`(
  select count(*)::int from ${participants} as finisher
  where finisher.game_id = ${games.id}
    and finisher.status = 'confirmed'
    and finisher.late_joined = false
    and finisher.left_reason is null
)`;

// 자작 룰 세션은 세션 수에는 세고, 룰별 업적과 「다양한 룰」 종류 수에서는 뺀다. 룰 분류를 비워 두면 그 둘이 건너뛴다.
const isHomebrew = sql`exists (select 1 from ${homebrewRules} where ${homebrewRules.rulebookId} = ${rulebooks.id})`;

export const categoryColumns = {
  categoryId: sql<
    string | null
  >`case when ${isHomebrew} then null else ${rulebookCategories.id} end`,
  categoryName: sql<
    string | null
  >`case when ${isHomebrew} then null else coalesce(${rulebookCategories.alias}, ${rulebookCategories.name}) end`,
};

export const sessionColumns = {
  gameId: games.id,
  title: games.title,
  confirmedAt: firstRoundStartSql,
  playMinutes: games.playMinutes,
  endedAt: firstRoundEndedAtSql,
  attendanceConfirmedAt: firstRoundAttendanceConfirmedAtSql,
  hiddenAt: games.hiddenAt,
  cancelledAt: games.cancelledAt,
  ...categoryColumns,
  attendedCount,
  registeredAt: games.createdAt,
};
