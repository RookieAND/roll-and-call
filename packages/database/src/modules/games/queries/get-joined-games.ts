import { and as allOf, count, desc, eq as equals, isNotNull, sql } from "drizzle-orm";
import { isNull } from "es-toolkit";

import { db } from "#db/client";
import { memberNicknameSql } from "#db/modules/profiles";
import { gameRounds, participants, roundAttendances } from "#db/schema";

import { GAME_LIST_COLUMNS } from "./game-list-columns";

export async function getJoinedGames({ serverId, userId }: { serverId: string; userId: string }) {
  const rows = await db.query.participants.findMany({
    where: (participant, { and, eq }) =>
      and(eq(participant.serverId, serverId), eq(participant.userId, userId)),
    orderBy: desc(participants.joinedAt),
    with: {
      game: {
        columns: GAME_LIST_COLUMNS,
        with: {
          gm: { columns: { avatarUrl: true }, extras: { username: memberNicknameSql(serverId) } },
          participants: {
            columns: {
              userId: true,
              status: true,
              joinedAt: true,
              drawRank: true,
              waitlistedAt: true,
              absent: true,
              absenceCancelledAt: true,
              absenceAt: true,
              lateJoined: true,
              leftReason: true,
            },
            where: (participant, { eq }) => eq(participant.serverId, serverId),
          },
        },
      },
    },
  });
  // 다회차 참여 세션은 출석을 확정하고 끝난 회차 가운데 내가 참석한 회차마다 하나다.
  const attendedRounds = await db
    .select({ gameId: roundAttendances.gameId, attendedRoundCount: count() })
    .from(roundAttendances)
    .innerJoin(gameRounds, equals(gameRounds.id, roundAttendances.roundId))
    .where(
      allOf(
        equals(roundAttendances.serverId, serverId),
        equals(roundAttendances.userId, userId),
        equals(roundAttendances.attended, true),
        isNotNull(gameRounds.attendanceConfirmedAt),
        sql`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt}) <= now()`,
      ),
    )
    .groupBy(roundAttendances.gameId);
  const attendedRoundCountOf = new Map(
    attendedRounds.map((row) => [row.gameId, row.attendedRoundCount]),
  );
  // 운영진이 취소한 불참은 불참으로 세지 않는다.
  return rows.map(({ game }) => ({
    ...game,
    attendedRoundCount: attendedRoundCountOf.get(game.id) ?? 0,
    participants: game.participants.map(({ absenceCancelledAt, ...participant }) => ({
      ...participant,
      absent: participant.absent && isNull(absenceCancelledAt),
    })),
  }));
}
