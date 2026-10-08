import { sql } from "drizzle-orm";

import { games, participants, rulebookCategories } from "#/schema";

// attendedWhere와 같은 조건. 참여 쿼리가 participants를 이미 조인하므로 별칭으로 센다.
export const attendedCount = sql<number>`(
  select count(*)::int from ${participants} as attendee
  where attendee.game_id = ${games.id}
    and attendee.status = 'confirmed'
    and (attendee.absent = false or attendee.absence_cancelled_at is not null)
)`;

export const sessionColumns = {
  gameId: games.id,
  title: games.title,
  confirmedAt: games.confirmedAt,
  playMinutes: games.playMinutes,
  endedAt: games.endedAt,
  attendanceConfirmedAt: games.attendanceConfirmedAt,
  hiddenAt: games.hiddenAt,
  cancelledAt: games.cancelledAt,
  categoryId: rulebookCategories.id,
  categoryName: sql<
    string | null
  >`coalesce(${rulebookCategories.alias}, ${rulebookCategories.name})`,
  attendedCount,
  registeredAt: games.createdAt,
};
