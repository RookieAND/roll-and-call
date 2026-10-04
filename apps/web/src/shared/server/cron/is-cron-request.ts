import { timingSafeEqual } from "node:crypto";

// 크론 라우트는 Vercel Cron(GET)과 Supabase pg_cron(POST)이 함께 쓴다. 둘 다 Bearer CRON_SECRET을 보낸다.
// pg_cron이 부르는 라우트는 POST만 받고 Vercel은 부르지 않는다. 처리한 수를 { ok: true, ... }로 돌려준다.
// 오래 걸릴 수 있으면 export const maxDuration = 60을 둔다. 등록 방법은 README의 크론 절.
export function isCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || !header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
