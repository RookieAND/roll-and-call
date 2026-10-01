import { and, eq, isNotNull, ne, or } from "drizzle-orm";

import { db } from "../../client";
import { DEFAULT_PLAY_MINUTES } from "../../rules";
import { games, participants } from "../../schema";

const SLOT_MS = 30 * 60 * 1000;

// 시작 칸만이 아니라 플레이타임 길이만큼 막는다.
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
    const end = row.confirmedAt!.getTime() + (row.playMinutes || DEFAULT_PLAY_MINUTES) * 60 * 1000;
    for (let slotTime = start; slotTime < end; slotTime += SLOT_MS) {
      slots.add(new Date(slotTime).toISOString());
    }
  }
  return [...slots];
}
