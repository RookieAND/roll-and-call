import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers, servers } from "../../../schema";
import { evaluateBadges } from "./evaluate-badges";

// ponytail: 서버마다 전체 멤버를 차례로 다시 계산한다. 사용자가 수천 명을 넘어 크론이 느려지면 최근 기록이 바뀐 사람만 고른다.
export async function evaluateAllBadges(now: Date = new Date()) {
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    const members = await db
      .select({ userId: serverMembers.userId })
      .from(serverMembers)
      .where(eq(serverMembers.serverId, server.id));
    await evaluateBadges({
      serverId: server.id,
      userIds: members.map((member) => member.userId),
      now,
    });
  }
}
