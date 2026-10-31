import "server-only";
import { evaluateGameBadges, syncMonthlyBadges } from "@roll-and-call/database/badges";
import { notifyPrivateSessions, notifyReviewAvailable } from "@roll-and-call/database/games";
import { notifyCanvasGameStarted } from "@roll-and-call/integrations/canvas";
import { uniq } from "es-toolkit";

// pg_cron session-ended-tasks가 5분마다, 후기 알림이 남은 구인이나 비공개 구인의 알림이 남은 구인이 있을 때만 부른다(0119, 0123).
// 종료 판정이 지난 구인에는 후기 작성 웹 알림을 한 번 보내고, 종료 전에 확정된 출석이 이제 인정 세션이 되므로 업적을 다시 센다.
export async function runSessionEndedCron() {
  const counts = { failed: 0, reviewNotified: 0, privateNotified: 0 };
  // 비공개 구인의 1시간 전·시작 웹 알림도 같은 크론이 보낸다(0123). 한쪽이 실패해도 다른 쪽은 돈다.
  try {
    const { notified, startedGameIds } = await notifyPrivateSessions();
    counts.privateNotified = notified;
    // 비공개 구인은 디스코드 시작 안내를 거치지 않으므로 Canvas 포인트 이벤트도 여기서 보낸다. 실패해도 알림은 이미 나갔다.
    for (const gameId of startedGameIds) {
      try {
        await notifyCanvasGameStarted({ gameId });
      } catch (error) {
        console.error("Canvas 구인 시작 알림 실패", { gameId, error });
      }
    }
  } catch (error) {
    counts.failed += 1;
    console.error("비공개 구인 알림 실패", { error });
  }
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
