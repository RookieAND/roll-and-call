import { db } from "#db/client";
import { servers } from "#db/schema";

import { loadBadgeCandidateIds } from "../queries/load-badge-candidate-ids";
import { evaluateBadges } from "./evaluate-badges";

// 서버마다 기록이 있는 멤버를 차례로 다시 계산한다. 이벤트가 놓친 것을 주 1회 보정하고, 사다리 기준을 바꿔 배포한 뒤에도 쓴다.
// 이달의 뱃지는 부르는 쪽(badges 크론)이 먼저 맞춘다.
// ponytail: 직렬이다. 대상이 수천 명을 넘어 함수 한도에 닿으면 서버·구간 단위로 나눠 부른다.
export async function evaluateAllBadges({
  now = new Date(),
  silent = false,
}: { now?: Date; silent?: boolean } = {}) {
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    await evaluateBadges({
      serverId: server.id,
      userIds: await loadBadgeCandidateIds(server.id),
      now,
      silent,
      syncMonthly: false,
    });
  }
}
