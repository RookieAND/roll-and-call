import { and, eq, isNotNull, ne, or } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { plannedEndAt } from "#/modules/games/model/session-timing";
import { games, participants } from "#/schema";

const SLOT_MS = 30 * 60 * 1000;

// 이미 확정된 세션이 차지한 칸이다(GM이거나 자리가 확정된 참가자). 대기·제외된 신청은 막지 않는다. 시작 칸만이 아니라 플레이타임 길이만큼 막는다.
export async function getUserConfirmedSlots({
  serverId,
  userId,
  excludeGameId,
}: {
  serverId: string;
  userId: string;
  excludeGameId: string;
}): Promise<string[]> {
  const rows = await db
    .selectDistinct({ confirmedAt: games.confirmedAt, playMinutes: games.playMinutes })
    .from(games)
    .leftJoin(
      participants,
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, games.id),
        eq(participants.userId, userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .where(
      and(
        eq(games.serverId, serverId),
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.gmId, userId), eq(participants.userId, userId)),
      ),
    );

  const slots = new Set<string>();
  for (const row of rows) {
    // KST +9h도 30분의 배수라 UTC에서 30분 경계로 내려도 같은 칸이다.
    const start = Math.floor(row.confirmedAt!.getTime() / SLOT_MS) * SLOT_MS;
    const end = plannedEndAt(row)!.getTime();
    for (let slotTime = start; slotTime < end; slotTime += SLOT_MS) {
      slots.add(new Date(slotTime).toISOString());
    }
  }
  return [...slots];
}
