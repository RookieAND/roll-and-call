import { evaluateGameBadges, syncMonthlyBadges } from "@roll-and-call/database/badges";
import { autoConfirmAttendance } from "@roll-and-call/database/games";
import { uniq } from "es-toolkit";

import { isCronRequest } from "@/shared/server";

export const maxDuration = 60;

// pg_cron이 매시 5분에 부른다(attendance-auto-confirm). 기한이 지난 출석을 확정하고 그 구인의 업적을 다시 센다.
// 이달의 뱃지는 구인마다 맞추지 않고 서버마다 한 번만 맞춘다.
export async function POST(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const autoConfirmed = await autoConfirmAttendance();
  for (const { serverId, gameId } of autoConfirmed) {
    try {
      await evaluateGameBadges({ serverId, gameId, syncMonthly: false });
    } catch (error) {
      console.error(error);
    }
  }
  const now = new Date();
  for (const serverId of uniq(autoConfirmed.map((game) => game.serverId))) {
    try {
      await syncMonthlyBadges({ serverId, now });
    } catch (error) {
      console.error(error);
    }
  }
  return Response.json({ ok: true, autoConfirmed: autoConfirmed.length });
}
