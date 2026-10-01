import { and, eq, isNull, lt, or, sql } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers } from "../../../schema";

// 서버 화면마다 부르므로 10분 안에 다시 들어오면 쓰지 않는다. 순서만 맞으면 되는 값이다.
export async function markMemberVisit({ serverId, userId }: { serverId: string; userId: string }) {
  await db
    .update(serverMembers)
    .set({ lastVisitedAt: sql`now()` })
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        eq(serverMembers.userId, userId),
        isNull(serverMembers.deletedAt),
        or(
          isNull(serverMembers.lastVisitedAt),
          lt(serverMembers.lastVisitedAt, sql`now() - interval '10 minutes'`),
        ),
      ),
    );
}
