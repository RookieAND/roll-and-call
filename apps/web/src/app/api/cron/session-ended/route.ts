import { listDueEndNotices } from "@roll-and-call/database/games";
import { getServerById } from "@roll-and-call/database/servers";

import { isCronRequest, notifyGameEnded } from "@/shared/server";

export const maxDuration = 60;

// pg_cron notify-session-ended가 5분마다, 끝났는데 안내하지 않은 구인이 있을 때만 부른다(0091). GM이 마치기를 누르면 그 자리에서 이미 나가고, 예정 종료 시각이 지난 세션을 여기서 올린다.
// 한 건이 실패해도 나머지를 이어 간다. 안내 권리를 먼저 가져가므로 실패한 글은 다시 집히지 않는다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const due = await listDueEndNotices({ now: new Date() });

  const counts = { due: due.length, failed: 0 };
  for (const { id: gameId, serverId } of due) {
    try {
      const server = await getServerById(serverId);
      if (server) await notifyGameEnded({ server, gameId });
    } catch (error) {
      counts.failed += 1;
      console.error("notify-session-ended 실패", { gameId, error });
    }
  }
  return Response.json({ ok: true, ...counts });
}
