import { and, eq } from "drizzle-orm";

import {
  planAttendance,
  type AttendanceAbsence,
  type AttendanceChanges,
} from "#/modules/games/model/attendance-changes";
import { listAttendanceRows } from "#/modules/games/queries/list-attendance-rows";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 명단(지금 확정 + 세션 중 내보낸 사람)을 다시 쓴다. GM이 직접 확정할 때만 부른다(자동 확정은 결과를 덮지 않는다).
// 행 잠금은 따로 걸지 않는다. 부르는 쪽이 게임 행을 잠가(lockGame) 같은 구인의 쓰기가 줄을 선다.
export async function saveAttendance({
  transaction,
  serverId,
  gameId,
  rosterUserIds,
  absences,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  rosterUserIds: string[];
  absences: AttendanceAbsence[];
}): Promise<AttendanceChanges> {
  const rows = await listAttendanceRows({ transaction, serverId, gameId, userIds: rosterUserIds });
  const { updates, changes } = planAttendance({ rows, absences });
  for (const { userId, ...values } of updates) {
    await transaction
      .update(participants)
      .set(values)
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          eq(participants.userId, userId),
        ),
      );
  }
  return changes;
}
