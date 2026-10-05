import "server-only";
import type { Server } from "@roll-and-call/database";
import { evaluateGameBadges } from "@roll-and-call/database/badges";
import type { DrawLotteryResult } from "@roll-and-call/database/games";
import { DRAW_RESULT_KIND } from "@roll-and-call/database/games/model";
import { refreshRecruitPost } from "@roll-and-call/game-notices";

import { getGameById } from "./db/get-game-by-id";
import { announceRecruitmentComplete } from "./discord/announce-recruitment-complete";
import { notifyDrawResult } from "./discord/notify-draw-result";
import { seedAvailabilityFromProfile } from "./seed-availability-from-profile";

// 추첨 명령이 커밋된 뒤 할 일. 단계마다 실패해도 다음 단계를 이어 간다(디스코드 실패가 칭호 판정을 막지 않게).
export async function finishLotteryDraw({
  server,
  gameId,
  result,
}: {
  server: Server;
  gameId: string;
  result: DrawLotteryResult;
}) {
  const step = async (label: string, work: () => Promise<unknown>) => {
    try {
      await work();
    } catch (error) {
      console.error(`finishLotteryDraw ${label} 실패`, { gameId, error });
    }
  };

  if (result.kind === DRAW_RESULT_KIND.drawn || result.kind === DRAW_RESULT_KIND.confirmedAll) {
    await step("가능 시간", async () => {
      const game = await getGameById(server.id, gameId);
      if (!game) return;
      for (const userId of [...result.preConfirmedUserIds, ...result.confirmedUserIds]) {
        await step("가능 시간", () => seedAvailabilityFromProfile({ game, userId }));
      }
    });
    // 추첨을 생략한 글은 굴림이 없어 결과 공지·칭호 판정이 없다(D331).
    if (result.kind === DRAW_RESULT_KIND.drawn) {
      await step("디스코드 결과", () => notifyDrawResult({ server, gameId }));
    }
    if (result.becameFull) {
      await step("모집 완료", () => announceRecruitmentComplete({ server, gameId }));
    }
    if (result.kind === DRAW_RESULT_KIND.drawn) {
      await step("칭호", () => evaluateGameBadges({ serverId: server.id, gameId }));
    }
  }
  if (result.kind !== DRAW_RESULT_KIND.rejected) {
    await step("구인 글", () => refreshRecruitPost({ server, gameId }));
  }
}
