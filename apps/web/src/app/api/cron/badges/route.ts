import { evaluateAllBadges } from "@roll-and-call/database/badges";

import { isCronRequest } from "@/shared/server";

// Vercel Cron이 매일 00:05(KST)에 부른다. 달이 바뀌면 지난달 이달의 GM·PL을 붙이고, 출시 때는 과거 기록으로 전체 뱃지를 채운다. 출석 자동 확정은 매시 5분 /api/cron/attendance가 한다.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  await evaluateAllBadges();
  return Response.json({ ok: true });
}
