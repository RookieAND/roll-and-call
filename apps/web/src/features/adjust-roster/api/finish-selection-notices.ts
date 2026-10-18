import "server-only";
import type { Server } from "@roll-and-call/database";
import type { FinishSelectionResult } from "@roll-and-call/database/games";
import { refreshRecruitPost } from "@roll-and-call/game-notices";

import { seedAvailabilityFromProfile } from "@/entities/availability/server";
import { getGameById, notifySelectionResult } from "@/shared/server";

// 선발 마치기가 커밋된 뒤 할 일. 정원이 차도 모집 완료 공지는 내지 않는다(선발 결과 하나만 나간다). 단계마다 실패해도 다음 단계를 이어 간다.
export async function finishSelectionNotices({
  server,
  gameId,
  result,
}: {
  server: Server;
  gameId: string;
  result: Extract<FinishSelectionResult, { kind: "finished" }>;
}) {
  const step = async (label: string, work: () => Promise<unknown>) => {
    try {
      await work();
    } catch (error) {
      console.error(`finishSelectionNotices ${label} 실패`, { gameId, error });
    }
  };

  await step("가능 시간", async () => {
    const game = await getGameById(server.id, gameId);
    if (!game) return;
    for (const userId of result.confirmedUserIds) {
      await step("가능 시간", () => seedAvailabilityFromProfile({ game, userId }));
    }
  });
  await step("디스코드 결과", () => notifySelectionResult({ server, gameId }));
  await step("구인 글", () => refreshRecruitPost({ server, gameId }));
}
