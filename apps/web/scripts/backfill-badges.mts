import { evaluateAllBadges, syncAllMonthlyBadges } from "@roll-and-call/database/badges";

// 일회성: 새로 낸 칭호를 기존 기록으로 소급한다. 모든 서버의 멤버를 다시 계산하고(알림·획득 시트 없이 조용히),
// 이어서 월 정산을 돌려 명예의 전당(이달의 GM·PL 3회)도 채운다. --apply 없이는 아무것도 쓰지 않는다.
// 이미 받은 칭호는 그대로이고, 조건을 더는 채우지 못하는 칭호만 회수되므로 다시 실행해도 안전하다.
// 실행: NODE_OPTIONS=--conditions=react-server pnpm dlx tsx --env-file=.env.local scripts/backfill-badges.mts [--apply]
const apply = process.argv.includes("--apply");

if (!apply) {
  console.log(
    "[계획] 모든 서버의 멤버 칭호를 조용히 다시 계산하고 월 정산을 돌립니다. 실행하려면 --apply를 붙이세요.",
  );
  process.exit(0);
}

const now = new Date();
const startedAt = Date.now();
await evaluateAllBadges({ now, silent: true });
await syncAllMonthlyBadges(now);
console.log(`소급 완료: ${Math.round((Date.now() - startedAt) / 1000)}초`);
process.exit(0);
