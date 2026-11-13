import "server-only";
import { findScheduleConflicts, type SchedulePerson } from "@roll-and-call/database/games";
import { effectivePlayMinutes } from "@roll-and-call/database/games/model";
import type { Transaction } from "@roll-and-call/database/transaction";

import {
  scheduleConflictRejection,
  type ScheduleConflictRejection,
} from "../model/schedule-conflict-rejection";

const MINUTE_MS = 60_000;
// 한 회차는 24시간을 넘을 수 없다(game_rounds_time_shape).
const ROUND_MAX_MINUTES = 24 * 60;

// GM이 단발(회차 1) 시간을 정하거나 바꿀 때: GM과 확정·대기 신청자 각자의 다른 세션과 겹치면 거부 값을 돌려준다.
// gameId는 이미 있는 구인이면 그 구인(비교에서 뺀다), 등록이면 null이다.
export async function checkScheduleConflicts({
  transaction,
  serverId,
  gameId,
  gmId,
  confirmedUserIds,
  waitingUserIds = [],
  startsAt,
  playMinutes,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string | null;
  gmId: string;
  confirmedUserIds: readonly string[];
  waitingUserIds?: readonly string[];
  startsAt: Date;
  playMinutes: number | null;
}): Promise<ScheduleConflictRejection | null> {
  const minutes = Math.min(effectivePlayMinutes(playMinutes), ROUND_MAX_MINUTES);
  const people: SchedulePerson[] = [
    { userId: gmId, role: "gm" },
    ...confirmedUserIds.map((userId) => ({ userId, role: "confirmed" as const })),
    ...waitingUserIds.map((userId) => ({ userId, role: "waiting" as const })),
  ];
  const conflicts = await findScheduleConflicts({
    transaction,
    serverId,
    gameId,
    people,
    target: [{ roundNo: 1, startsAt, endsAt: new Date(startsAt.getTime() + minutes * MINUTE_MS) }],
  });
  return conflicts.length > 0 ? scheduleConflictRejection(conflicts) : null;
}
