import "server-only";
import { evaluateGameBadges, syncMonthlyBadges } from "@roll-and-call/database/badges";
import { notifyReviewAvailable } from "@roll-and-call/database/games";
import { uniq } from "es-toolkit";

// pg_cron session-ended-tasks가 5분마다, 종료 판정이 지났는데 후기 알림을 보내지 않은 구인이 있을 때만 부른다(0119).
// 종료 판정이 지난 구인에는 후기 작성 웹 알림을 한 번 보내고, 종료 전에 확정된 출석이 이제 인정 세션이 되므로 업적을 다시 센다.
export async function runSessionEndedCron() {
  const counts = { failed: 0, reviewNotified: 0 };
  try {
    const { notified, ended } = await notifyReviewAvailable();
    counts.reviewNotified = notified;
    for (const { serverId, gameId } of ended) {
      try {
        await evaluateGameBadges({ serverId, gameId, syncMonthly: false });
      } catch (error) {
        console.error("종료 뒤 업적 평가 실패", { gameId, error });
      }
    }
    const now = new Date();
    for (const serverId of uniq(ended.map((game) => game.serverId))) {
      try {
        await syncMonthlyBadges({ serverId, now });
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    counts.failed += 1;
    console.error("후기 작성 알림 실패", { error });
  }
  return { ok: true, ...counts };
}
