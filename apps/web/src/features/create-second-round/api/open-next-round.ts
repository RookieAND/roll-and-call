import "server-only";
import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import { availabilities, db, games, participants, type Game } from "@/shared/server";

import type { SecondRoundInput } from "../model/second-round";

export async function openNextRound(
  parent: Game,
  carried: { userId: string }[],
  { rangeStart, rangeEnd }: SecondRoundInput,
): Promise<string> {
  return db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(games)
      .values({
        gmId: parent.gmId,
        title: parent.title,
        rule: parent.rule,
        synopsis: parent.synopsis,
        thumbnailUrl: parent.thumbnailUrl,
        thumbnailSpoiler: parent.thumbnailSpoiler,
        images: parent.images,
        playTime: parent.playTime,
        maxPlayers: parent.maxPlayers,
        waitlistEnabled: parent.waitlistEnabled,
        scheduleMode: SCHEDULE_MODE.coordinate,
        // KST 자정 기준. 서버 타임존에 따라 마감이 밀리지 않게 오프셋을 명시한다.
        endDate: new Date(`${rangeEnd}T23:59:59+09:00`),
        rangeStart,
        rangeEnd,
        parentGameId: parent.id,
        round: parent.round + 1,
      })
      .returning({ id: games.id });
    const roundId = created!.id;

    await transaction.insert(participants).values(
      carried.map((participant, index) => ({
        gameId: roundId,
        userId: participant.userId,
        status:
          index < parent.maxPlayers ? PARTICIPANT_STATUS.confirmed : PARTICIPANT_STATUS.waiting,
      })),
    );

    // ponytail: 이전 회차에 입력해둔 가능 시간표를 그대로 옮긴다. 새 조율 기간
    // 밖의 슬롯은 그리드에 안 뜰 뿐 해가 없다 — "조율 처음부터 안 함" 약속만 지킨다.
    const carriedIds = new Set(carried.map((participant) => participant.userId));
    const previousSlots = await db.query.availabilities.findMany({
      where: (table, { eq: equals }) => equals(table.gameId, parent.id),
    });
    const slotsToCopy = previousSlots
      .filter((slot) => carriedIds.has(slot.userId))
      .map((slot) => ({ gameId: roundId, userId: slot.userId, slotStart: slot.slotStart }));
    if (slotsToCopy.length > 0) {
      await transaction.insert(availabilities).values(slotsToCopy);
    }

    for (const participant of carried) {
      await transaction
        .delete(participants)
        .where(
          and(eq(participants.gameId, parent.id), eq(participants.userId, participant.userId)),
        );
    }

    return roundId;
  });
}
