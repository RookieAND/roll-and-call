import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#db/client";
import { availabilities, participants } from "#db/schema";

// 이 구인 참여자 중 본인이 저장한 사람(자동 저장 제외, R15).
// 제출 표시는 구인 단위라 2회차부터는 그 회차에 칸을 하나라도 남긴 사람으로 센다(0칸 저장은 응답으로 잡히지 않는다).
export async function getRespondedUserIds({
  serverId,
  gameId,
  roundNo = 1,
}: {
  serverId: string;
  gameId: string;
  roundNo?: number;
}): Promise<string[]> {
  if (roundNo > 1) {
    const rows = await db
      .selectDistinct({ userId: availabilities.userId })
      .from(availabilities)
      .where(
        and(
          eq(availabilities.serverId, serverId),
          eq(availabilities.gameId, gameId),
          eq(availabilities.roundNo, roundNo),
        ),
      );
    return rows.map((row) => row.userId);
  }
  const rows = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        isNotNull(participants.availabilitySubmittedAt),
      ),
    );
  return rows.map((row) => row.userId);
}
