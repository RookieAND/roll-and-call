import { expireSelection, listDueSelectionDeadlines } from "@roll-and-call/database/games";
import { getServerById } from "@roll-and-call/database/servers";
import { withTransaction } from "@roll-and-call/database/transaction";

import { isCronRequest, notifyGameCancelled } from "@/shared/server";

export const maxDuration = 60;

// pg_cron expire-selection-deadlines가 10분마다, 기한이 지난 선발 글이 있을 때만 부른다(0102). 선발을 마치지 못한 글을 취소한다.
// 한 건이 실패해도 나머지를 이어 가고, 실패한 글은 다음 회차에 다시 집힌다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const due = await listDueSelectionDeadlines({ now: new Date() });

  const counts = { checked: due.length, expired: 0, failed: 0 };
  for (const { id: gameId, serverId } of due) {
    try {
      const result = await withTransaction((transaction) =>
        expireSelection({ transaction, serverId, gameId, now: new Date() }),
      );
      if (result.kind === "skipped") continue;
      counts.expired += 1;
      const server = await getServerById(serverId);
      if (server) await notifyGameCancelled({ server, game: result.game });
    } catch (error) {
      counts.failed += 1;
      console.error("expire-selection 실패", { gameId, error });
    }
  }
  return Response.json({ ok: true, ...counts });
}
