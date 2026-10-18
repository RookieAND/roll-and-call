import "server-only";
import { judgeMinPlayersForGame, listDueMinPlayers } from "@roll-and-call/database/games";
import { getServerById } from "@roll-and-call/database/servers";
import { withTransaction } from "@roll-and-call/database/transaction";
import { notifyGameCancelled } from "@roll-and-call/game-notices";

// pg_cron judge-min-players가 10분마다, 판정할 선착순 글이 있을 때만 부른다(0089). 마감이 지난 글을 한 번만 판정하고 미달이면 취소한다.
// 추첨 글은 추첨 명령이 판정한다. 한 건이 실패해도 나머지를 이어 가고, 판정이 실패한 글은 다음 회차에 다시 집힌다.
// 취소 알림은 판정이 커밋된 뒤라 실패해도 다시 보내지 않는다(로그만 남긴다).
export async function runMinPlayersCron() {
  const due = await listDueMinPlayers({ now: new Date() });

  const counts = { judged: 0, passed: 0, cancelled: 0, failed: 0, noticeFailed: 0 };
  for (const { id: gameId, serverId } of due) {
    try {
      const server = await getServerById(serverId);
      if (!server) throw new Error("server not found");
      const result = await withTransaction((transaction) =>
        judgeMinPlayersForGame({ transaction, serverId, gameId, now: new Date() }),
      );
      if (result.kind === "skipped") continue;
      counts.judged += 1;
      if (result.kind === "passed") {
        counts.passed += 1;
        continue;
      }
      counts.cancelled += 1;
      try {
        await notifyGameCancelled({ server, game: result.game });
      } catch (error) {
        counts.noticeFailed += 1;
        console.error("judge-min-players 취소 알림 실패", { gameId, error });
      }
    } catch (error) {
      counts.failed += 1;
      console.error("judge-min-players 실패", { gameId, error });
    }
  }
  return { ok: true, ...counts };
}
