import { db } from "#/client";
import { servers } from "#/schema";

import { evaluateBadges } from "./evaluate-badges";
import { loadBadgeCandidateIds } from "./load-badge-candidate-ids";

// 서버마다 기록이 있는 멤버를 차례로 다시 계산한다. 이벤트가 놓친 것을 주 1회 보정하고, 사다리 기준을 바꿔 배포한 뒤에도 쓴다.
// ponytail: 직렬이다. 대상이 수천 명을 넘어 함수 한도에 닿으면 서버·구간 단위로 나눠 부른다.
export async function evaluateAllBadges(now: Date = new Date()) {
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    await evaluateBadges({
      serverId: server.id,
      userIds: await loadBadgeCandidateIds(server.id),
      now,
    });
  }
}
