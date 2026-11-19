import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Executor } from "#db/modules/transaction";
import { participants } from "#db/schema";

// 지금 확정 참여자와 완주 여부. 확정으로 남은 사람 중 중도 합류가 아닌 사람이 완주다(isFinisher와 같은 규칙).
export async function listRosterFinishers({
  executor,
  serverId,
  gameId,
}: {
  executor: Executor;
  serverId: string;
  gameId: string;
}) {
  const rows = await executor
    .select({ userId: participants.userId, lateJoined: participants.lateJoined })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    );
  return rows.map((row) => ({ userId: row.userId, finisher: !row.lateJoined }));
}
