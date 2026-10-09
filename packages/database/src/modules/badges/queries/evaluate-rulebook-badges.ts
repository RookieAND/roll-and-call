import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_LADDER } from "#/modules/badges/model/badge-ladder";
import { BADGE_LADDERS } from "#/modules/badges/model/badge-ladders";
import { certifications, servers } from "#/schema";

import { evaluateBadges } from "./evaluate-badges";

// 룰북 인증 칭호를 처음 연 뒤의 소급용. 첫 단계 기준 이상으로 인증한 사람만 다시 계산한다(certifications PK가 서버·유저로 묶는다).
export async function evaluateRulebookBadges({
  now = new Date(),
  silent = false,
}: { now?: Date; silent?: boolean } = {}) {
  const minimum = BADGE_LADDERS[BADGE_LADDER.rulebooks].steps[0]!.threshold;
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    const rows = await db
      .select({ userId: certifications.userId })
      .from(certifications)
      .where(and(eq(certifications.serverId, server.id), isNull(certifications.revokedAt)))
      .groupBy(certifications.userId)
      .having(sql`count(*) >= ${minimum}`);
    await evaluateBadges({
      serverId: server.id,
      userIds: rows.map((row) => row.userId),
      now,
      silent,
    });
  }
}
