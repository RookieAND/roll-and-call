import { and, asc, eq, isNull, lte, or, sql } from "drizzle-orm";

import { db } from "#/client";
import { RECRUIT_METHOD } from "#/modules/games/model/recruit-method";
import { SCHEDULE_MODE } from "#/modules/games/model/schedule-mode";
import { selectionDeadline } from "#/modules/games/model/selection-deadline";
import { games } from "#/schema";

// 선발 기한 크론이 집는 글: 선발을 마치지 않은 선발 글 가운데 기한이 지난 것(games_selection_due_idx).
// 기한은 selectionDeadline이 정한다. SQL은 같은 규칙으로 후보를 좁히고, 정확한 판정은 함수로 다시 한다(한 번에 limit건).
export async function listDueSelectionDeadlines({
  now,
  limit = 50,
}: {
  now: Date;
  limit?: number;
}) {
  const rows = await db
    .select({
      id: games.id,
      serverId: games.serverId,
      endDate: games.endDate,
      scheduleMode: games.scheduleMode,
      confirmedAt: games.confirmedAt,
      rangeEnd: games.rangeEnd,
    })
    .from(games)
    .where(
      and(
        eq(games.recruitMethod, RECRUIT_METHOD.selection),
        isNull(games.selectionFinishedAt),
        isNull(games.cancelledAt),
        lte(games.endDate, now),
        or(
          sql`${games.endDate} + interval '7 days' <= ${now}`,
          and(eq(games.scheduleMode, SCHEDULE_MODE.fixed), lte(games.confirmedAt, now)),
          and(
            eq(games.scheduleMode, SCHEDULE_MODE.coordinate),
            sql`(${games.rangeEnd}::timestamp + interval '1 day') at time zone 'Asia/Seoul' <= ${now}`,
          ),
        ),
      ),
    )
    .orderBy(asc(games.endDate))
    .limit(limit);
  return rows
    .filter((row) => selectionDeadline(row).getTime() <= now.getTime())
    .map(({ id, serverId }) => ({ id, serverId }));
}
