import { and, eq, or, sql } from "drizzle-orm";

import { db } from "#/client";
import { serverMembers, servers } from "#/schema";

import { evaluateBadges } from "./evaluate-badges";

// hidden-events의 oneMonth·halfYear·oneYear 기준. 날짜가 지나서 붙는 뱃지라 이벤트가 없어도 붙도록 매일 확인한다.
const ANNIVERSARY_MONTHS = [1, 6, 12];
const WINDOW_DAYS = 2;

// 최근 이틀 안에 가입 기념일이 지난 멤버만 다시 계산한다. 하루 실패해도 다음 날 잡힌다.
export async function evaluateAnniversaryBadges(now: Date = new Date()) {
  for (const server of await db.select({ id: servers.id }).from(servers)) {
    const members = await db
      .select({ userId: serverMembers.userId })
      .from(serverMembers)
      .where(
        and(
          eq(serverMembers.serverId, server.id),
          or(
            ...ANNIVERSARY_MONTHS.map((months) => {
              const anniversary = sql`${serverMembers.joinedAt} + make_interval(months => ${months})`;
              return sql`${anniversary} <= ${now.toISOString()}::timestamptz and ${anniversary} > ${now.toISOString()}::timestamptz - make_interval(days => ${WINDOW_DAYS})`;
            }),
          ),
        ),
      );
    if (members.length > 0) {
      await evaluateBadges({ serverId: server.id, userIds: members.map((m) => m.userId), now });
    }
  }
}
