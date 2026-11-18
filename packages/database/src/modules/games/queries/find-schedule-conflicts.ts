import { and, eq, inArray, isNotNull, isNull, ne, sql } from "drizzle-orm";

import { db } from "#db/client";
import { lockUserApplications } from "#db/modules/games/commands/lock-user-applications";
import {
  overlappingPairs,
  type RoundSpan,
  type TargetRound,
} from "#db/modules/games/model/overlapping-round-numbers";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games, participants } from "#db/schema";

export type ScheduleRole = "gm" | "confirmed" | "waiting";

export type SchedulePerson = { userId: string; role: ScheduleRole };

// 겹친 상대 세션의 회차. 상대 구인의 정보라 신청하는 본인에게만 보인다. GM에게 돌려줄 때는 호출한 쪽이 뺀다.
export type ScheduleOverlap = {
  targetRoundNo: number;
  gameId: string;
  gameTitle: string;
  // 상대 구인의 예정 회차 수. 1이면 단발이다.
  gameRoundCount: number;
  roundNo: number;
  startsAt: Date;
  endsAt: Date;
};

// 겹친 사람 한 명: 이 구인에서의 역할, 겹친 목표 회차 번호, 겹친 상대 회차.
export type ScheduleConflict = {
  userId: string;
  role: ScheduleRole;
  roundNos: number[];
  overlaps: ScheduleOverlap[];
};

// 한 사람의 세션은 서로 겹칠 수 없다. 사람마다 같은 서버에서 GM이거나 확정·대기·추첨(선발) 신청 중인 구인의
// 일시가 정해진 회차(끝나지 않은 것)와 목표 회차를 비교한다. gameId는 목표 구인이라 비교에서 뺀다(등록 때는 null).
// 같은 사람의 신청·일정 변경이 줄을 서도록 사람마다 잠그고, 교착을 피하려고 id 순서로 잠근다.
export async function findScheduleConflicts({
  transaction,
  serverId,
  gameId,
  people,
  target,
  now = new Date(),
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string | null;
  people: readonly SchedulePerson[];
  target: readonly TargetRound[];
  now?: Date;
}): Promise<ScheduleConflict[]> {
  if (people.length === 0 || target.length === 0) return [];
  const run = async (executor: Transaction) => {
    const userIds = [...new Set(people.map((person) => person.userId))].toSorted();
    for (const userId of userIds) await lockUserApplications({ transaction: executor, userId });

    const base = and(
      eq(games.serverId, serverId),
      gameId === null ? undefined : ne(games.id, gameId),
      isNull(games.cancelledAt),
      isNotNull(gameRounds.startAt),
      sql`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt}) > ${now.toISOString()}::timestamptz`,
    );
    const span = {
      gameId: games.id,
      gameTitle: games.title,
      gameRoundCount: games.roundCount,
      roundNo: gameRounds.roundNo,
      startsAt: gameRounds.startAt,
      endsAt: sql<Date>`coalesce(${gameRounds.endedAt}, ${gameRounds.plannedEndAt})`.mapWith(
        gameRounds.plannedEndAt,
      ),
    };
    const [hosted, joined] = await Promise.all([
      executor
        .select({ userId: games.gmId, ...span })
        .from(games)
        .innerJoin(gameRounds, eq(gameRounds.gameId, games.id))
        .where(and(base, inArray(games.gmId, userIds))),
      executor
        .select({ userId: participants.userId, ...span })
        .from(participants)
        .innerJoin(games, eq(games.id, participants.gameId))
        .innerJoin(gameRounds, eq(gameRounds.gameId, games.id))
        .where(
          and(
            base,
            inArray(participants.userId, userIds),
            ne(participants.status, PARTICIPANT_STATUS.removed),
          ),
        ),
    ]);

    type Other = RoundSpan & Omit<ScheduleOverlap, "targetRoundNo" | keyof RoundSpan>;
    const othersByUser = new Map<string, Other[]>();
    for (const row of [...hosted, ...joined]) {
      const others = othersByUser.get(row.userId) ?? [];
      others.push({
        gameId: row.gameId,
        gameTitle: row.gameTitle,
        gameRoundCount: row.gameRoundCount,
        roundNo: row.roundNo,
        startsAt: row.startsAt!,
        endsAt: row.endsAt,
      });
      othersByUser.set(row.userId, others);
    }
    return people.flatMap((person) => {
      const pairs = overlappingPairs({ target, others: othersByUser.get(person.userId) ?? [] });
      if (pairs.length === 0) return [];
      const overlaps = pairs.map(({ targetRoundNo, other }) => ({ targetRoundNo, ...other }));
      const roundNos = [...new Set(overlaps.map((overlap) => overlap.targetRoundNo))];
      return [{ ...person, roundNos, overlaps }];
    });
  };
  return transaction ? run(transaction) : db.transaction(run);
}
