import { and, eq, or } from "drizzle-orm";
import { groupBy } from "es-toolkit";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { memberNicknameSql } from "#db/modules/profiles";
import { gameRounds, games, participants, profiles } from "#db/schema";

import { getGameAvailabilities } from "./get-game-availabilities";
import { getRespondedUserIds } from "./get-responded-user-ids";

// 한 회차의 가능 시간 모으기 현황. 응답 대상은 GM과 확정 참여자다. 1회차에 회차 행의 기간이 비어 있으면 구인의 기간을 쓴다.
export async function getRoundCoordination({
  serverId,
  gameId,
  roundNo,
}: {
  serverId: string;
  gameId: string;
  roundNo: number;
}) {
  const [row] = await db
    .select({ round: gameRounds, game: games })
    .from(gameRounds)
    .innerJoin(games, and(eq(games.serverId, gameRounds.serverId), eq(games.id, gameRounds.gameId)))
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
  if (!row) return null;
  const { round, game } = row;
  const inherits = roundNo === 1;
  const [rows, respondedUserIds, members] = await Promise.all([
    getGameAvailabilities({ serverId, gameId, roundNo }),
    getRespondedUserIds({ serverId, gameId, roundNo }),
    db
      .select({ userId: profiles.id, username: memberNicknameSql(serverId) })
      .from(profiles)
      .leftJoin(
        participants,
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          eq(participants.userId, profiles.id),
        ),
      )
      .where(or(eq(profiles.id, game.gmId), eq(participants.status, PARTICIPANT_STATUS.confirmed))),
  ]);
  const responded = new Set(respondedUserIds);
  const byUser = groupBy(rows, (availability) => availability.userId);
  return {
    status: round.status,
    startAt: round.startAt,
    start: round.coordinationStart ?? (inherits ? game.rangeStart : null),
    end: round.coordinationEnd ?? (inherits ? game.rangeEnd : null),
    windowStartHour: round.coordinationWindowStartHour ?? (inherits ? game.windowStartHour : null),
    windowEndHour: round.coordinationWindowEndHour ?? (inherits ? game.windowEndHour : null),
    timezone: round.coordinationTimezone ?? (inherits ? "Asia/Seoul" : null),
    availabilities: rows,
    slotsByUser: Object.fromEntries(
      Object.entries(byUser).map(([userId, slots]) => [
        userId,
        slots.map((slot) => slot.slotStart),
      ]),
    ),
    respondedCount: members.filter((member) => responded.has(member.userId)).length,
    totalCount: members.length,
    pendingNames: members
      .filter((member) => !responded.has(member.userId))
      .map((member) => member.username),
  };
}
