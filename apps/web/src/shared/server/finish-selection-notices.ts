import "server-only";
import type { Server } from "@roll-and-call/database";
import type { FinishSelectionResult } from "@roll-and-call/database/games";
import { refreshRecruitPost } from "@roll-and-call/game-notices";

import { getGameById } from "./db/get-game-by-id";
import { announceRecruitmentComplete } from "./discord/announce-recruitment-complete";
import { notifySelectionResult } from "./discord/notify-selection-result";
import { seedAvailabilityFromProfile } from "./seed-availability-from-profile";

// 선발 마치기가 커밋된 뒤 할 일. 단계마다 실패해도 다음 단계를 이어 간다.
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
  if (result.becameFull) {
    await step("모집 완료", () => announceRecruitmentComplete({ server, gameId }));
  }
  await step("구인 글", () => refreshRecruitPost({ server, gameId }));
}
