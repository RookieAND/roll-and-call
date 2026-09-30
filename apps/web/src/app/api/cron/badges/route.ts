import { evaluateAllBadges } from "@roll-and-call/database/badges";

// Vercel Cron이 매일 00:05(KST)에 부른다. 달이 바뀌면 지난달 이달의 GM·PL을 붙이고, 출시 때는 과거 기록으로 전체 뱃지를 채운다.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  await evaluateAllBadges();
  return Response.json({ ok: true });
}
