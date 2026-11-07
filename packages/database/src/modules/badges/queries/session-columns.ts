import { sql } from "drizzle-orm";

import { games, homebrewRules, participants, rulebookCategories, rulebooks } from "#db/schema";

// attendedWhere와 같은 조건. 참여 쿼리가 participants를 이미 조인하므로 별칭으로 센다.
export const attendedCount = sql<number>`(
  select count(*)::int from ${participants} as attendee
  where attendee.game_id = ${games.id}
    and attendee.status = 'confirmed'
    and (attendee.absent = false or attendee.absence_cancelled_at is not null)
)`;

// 자작 룰 세션은 세션 수에는 세고, 룰별 업적과 「다양한 룰」 종류 수에서는 뺀다. 룰 분류를 비워 두면 그 둘이 건너뛴다.
const isHomebrew = sql`exists (select 1 from ${homebrewRules} where ${homebrewRules.rulebookId} = ${rulebooks.id})`;

export const sessionColumns = {
  gameId: games.id,
  title: games.title,
  confirmedAt: games.confirmedAt,
  playMinutes: games.playMinutes,
  endedAt: games.endedAt,
  attendanceConfirmedAt: games.attendanceConfirmedAt,
  hiddenAt: games.hiddenAt,
  cancelledAt: games.cancelledAt,
  categoryId: sql<
    string | null
  >`case when ${isHomebrew} then null else ${rulebookCategories.id} end`,
  categoryName: sql<
    string | null
  >`case when ${isHomebrew} then null else coalesce(${rulebookCategories.alias}, ${rulebookCategories.name}) end`,
  attendedCount,
  registeredAt: games.createdAt,
};
