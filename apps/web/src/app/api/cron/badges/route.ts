import {
  evaluateAllBadges,
  evaluateAnniversaryBadges,
  syncAllMonthlyBadges,
} from "@roll-and-call/database/badges";

import { announceMonthlyAwards, isCronRequest } from "@/shared/server";

const SUNDAY = 0;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// Vercel Cron이 매일 00:05(KST)에 부른다. 2일에는 지난달이 굳어 이달의 GM·PL을 붙이고 디스코드 공지 채널에 발표한다.
// 개인 뱃지는 이벤트가 바로 맞추므로 매일은 가입 기념일(날짜가 지나서 붙는 칭호)만 보고, 일요일에는 놓친 이벤트를 전체 재계산으로 보정한다.
// 오래 걸리는 전체 재계산은 월간 뱃지·공지 뒤에 두어 끊겨도 발표가 밀리지 않게 한다. 출석 자동 확정은 매시 5분 /api/cron/attendance가 한다.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const now = new Date();
  await syncAllMonthlyBadges(now);
  let announced = 0;
  try {
    announced = await announceMonthlyAwards({ now });
  } catch (error) {
    console.error("Monthly announcement failed:", error);
  }
  await evaluateAnniversaryBadges(now);
  const isSunday = new Date(now.getTime() + KST_OFFSET_MS).getUTCDay() === SUNDAY;
  if (isSunday) await evaluateAllBadges({ now });
  return Response.json({ ok: true, announced, recomputed: isSunday });
}
