import { judgeMinPlayersForGame, listDueMinPlayers } from "@roll-and-call/database/games";
import { getServerById } from "@roll-and-call/database/servers";
import { withTransaction } from "@roll-and-call/database/transaction";

import { isCronRequest, notifyGameCancelled } from "@/shared/server";

export const maxDuration = 60;

// pg_cron judge-min-players가 10분마다, 판정할 선착순 글이 있을 때만 부른다(0089). 마감이 지난 글을 한 번만 판정하고 미달이면 취소한다.
// 추첨 글은 추첨 명령이 판정한다. 한 건이 실패해도 나머지를 이어 가고, 실패한 글은 다음 회차에 다시 집힌다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const due = await listDueMinPlayers({ now: new Date() });

  const counts = { judged: 0, passed: 0, cancelled: 0, failed: 0 };
  for (const { id: gameId, serverId } of due) {
    try {
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
      const server = await getServerById(serverId);
      if (server) await notifyGameCancelled({ server, game: result.game });
    } catch (error) {
      counts.failed += 1;
      console.error("judge-min-players 실패", { gameId, error });
    }
  }
  return Response.json({ ok: true, ...counts });
}
