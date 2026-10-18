import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "#db/client";
import { BADGE_ROLE } from "#db/modules/badges/model/badge-ladder";
import { kstMonthKey } from "#db/modules/badges/model/kst-month-key";
import { LEADER_ROLES, monthLeaders } from "#db/modules/badges/model/month-leader";
import { monthStart } from "#db/modules/badges/model/month-start";
import type { MonthlyAppearance } from "#db/modules/badges/model/monthly-winners";
import { createNotifications } from "#db/modules/notifications";
import { MONTHLY_AWARD_ROLE, NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { notifications } from "#db/schema";

// 이 달의 기록 1위가 바뀌어 새로 1위가 된 사람에게 알림 한 줄을 넣는다.
// 포인트제는 한 명, 참여 횟수제는 공동 1위 모두가 대상이다. 1위를 빼앗긴 사람에게는 보내지 않는다.
// 이미 읽어 둔 기록(appearances)으로 1위를 가려 DB를 더 읽지 않고, 이번 달 1위 알림 기록만 작게 읽는다.
// 이미 알림을 받은 뒤 지금 1위가 아닌 다른 사람이 알림을 받은 적이 없으면(1위를 계속 지켰으면) 다시 보내지 않고, 되찾았을 때만 다시 보낸다.
export async function notifyRankLeaders({
  serverId,
  appearances,
  now,
  breakTies,
}: {
  serverId: string;
  appearances: MonthlyAppearance[];
  now: Date;
  breakTies: boolean;
}) {
  const month = kstMonthKey(now);
  for (const role of LEADER_ROLES) {
    const leaders = monthLeaders({ appearances, role, month, breakTies });
    if (leaders.length === 0) continue;
    const awardRole = role === BADGE_ROLE.gm ? MONTHLY_AWARD_ROLE.gm : MONTHLY_AWARD_ROLE.pl;
    await db.transaction(async (tx) => {
      // 같은 서버·역할의 동시 재계산이 알림을 두 번 넣지 않게 직렬화한다.
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`rank_leader:${serverId}:${awardRole}`}))`,
      );
      const sent = await tx
        .select({ userId: notifications.userId, createdAt: notifications.createdAt })
        .from(notifications)
        .where(
          and(
            eq(notifications.serverId, serverId),
            eq(notifications.kind, NOTIFICATION_KIND.rankLeader),
            gte(notifications.createdAt, monthStart(kstMonthKey(now))),
            sql`${notifications.params}->>'role' = ${awardRole}`,
          ),
        )
        .orderBy(desc(notifications.createdAt));
      const current = new Set(leaders);
      const targets = leaders.filter((userId) => {
        const last = sent.find((row) => row.userId === userId);
        if (!last) return true;
        // 그 뒤에 지금은 1위가 아닌 사람이 알림을 받았다면 그 사이 1위를 내줬던 것이다.
        return sent.some((row) => !current.has(row.userId) && row.createdAt > last.createdAt);
      });
      if (targets.length === 0) return;
      await createNotifications({
        executor: tx,
        serverId,
        actorId: null,
        notifications: targets.map((userId) => ({
          userId,
          kind: NOTIFICATION_KIND.rankLeader,
          params: {
            month: Number(month.slice(5)),
            role: awardRole,
            ...(breakTies ? {} : { unit: "count" as const }),
          },
        })),
      });
    });
  }
}
