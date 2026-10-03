import { evaluateAllBadges } from "@roll-and-call/database/badges";
import { autoConfirmAttendance } from "@roll-and-call/database/games";

// Vercel Cron이 매일 00:05(KST)에 부른다. 기한이 지난 출석을 먼저 확정해 업적 계산에 넣는다.
// 달이 바뀌면 지난달 이달의 GM·PL을 붙이고, 출시 때는 과거 기록으로 전체 뱃지를 채운다.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const autoConfirmed = await autoConfirmAttendance();
  await evaluateAllBadges();
  return Response.json({ ok: true, autoConfirmed: autoConfirmed.length });
}
