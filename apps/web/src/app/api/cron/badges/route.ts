import { evaluateAllBadges } from "@roll-and-call/database/badges";

import { announceMonthlyAwards, isCronRequest } from "@/shared/server";

// Vercel Cron이 매일 00:05(KST)에 부른다. 2일에는 지난달이 굳어 이달의 GM·PL을 붙이고 디스코드 공지 채널에 발표한다.
// 출시 때는 과거 기록으로 전체 뱃지를 채운다. 출석 자동 확정은 매시 5분 /api/cron/attendance가 한다.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const now = new Date();
  await evaluateAllBadges(now);
  let announced = 0;
  try {
    announced = await announceMonthlyAwards({ now });
  } catch (error) {
    console.error("Monthly announcement failed:", error);
  }
  return Response.json({ ok: true, announced });
}
