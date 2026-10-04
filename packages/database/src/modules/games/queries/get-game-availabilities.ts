import { and, eq, or } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { availabilities, games, participants, profiles } from "#/schema";

// 겹침·이름·추천 후보·제출 수는 확정자와 GM만 센다(R2). 행은 지우지 않는다.
export async function getGameAvailabilities({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const rows = await db
    .select({
      slotStart: availabilities.slotStart,
      userId: availabilities.userId,
      username: memberNicknameSql(serverId),
    })
    .from(availabilities)
    .innerJoin(
      games,
      and(eq(games.serverId, availabilities.serverId), eq(games.id, availabilities.gameId)),
    )
    .innerJoin(profiles, eq(profiles.id, availabilities.userId))
    .leftJoin(
      participants,
      and(
        eq(participants.serverId, availabilities.serverId),
        eq(participants.gameId, availabilities.gameId),
        eq(participants.userId, availabilities.userId),
      ),
    )
    .where(
      and(
        eq(availabilities.serverId, serverId),
        eq(availabilities.gameId, gameId),
        or(
          eq(games.gmId, availabilities.userId),
          eq(participants.status, PARTICIPANT_STATUS.confirmed),
        ),
      ),
    );
  return rows.map(({ username, ...row }) => ({ ...row, user: { username } }));
}
