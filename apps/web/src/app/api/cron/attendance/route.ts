import { evaluateGameBadges } from "@roll-and-call/database/badges";
import { autoConfirmAttendance } from "@roll-and-call/database/games";

import { isCronRequest } from "@/shared/server";

export const maxDuration = 60;

// pg_cron이 매시 5분에 부른다(attendance-auto-confirm). 기한이 지난 출석을 확정하고 그 구인의 업적을 다시 센다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const autoConfirmed = await autoConfirmAttendance();
  for (const { serverId, gameId } of autoConfirmed) {
    try {
      await evaluateGameBadges({ serverId, gameId });
    } catch (error) {
      console.error(error);
    }
  }
  return Response.json({ ok: true, autoConfirmed: autoConfirmed.length });
}
