import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "#/client";
import { BADGE_ROLE } from "#/modules/badges/model/badge-ladder";
import { kstMonthKey } from "#/modules/badges/model/kst-month-key";
import { LEADER_ROLES, monthLeader } from "#/modules/badges/model/month-leader";
import type { MonthlyAppearance } from "#/modules/badges/model/monthly-winners";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
} from "#/modules/notifications/model/notification-kind";
import { notifications } from "#/schema";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const startOfKstMonth = (now: Date) => {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  return new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), 1) - KST_OFFSET_MS);
};

// 포인트제 서버에서 이 달의 기록 1위가 바뀌어 새로 1위가 된 사람에게 알림 한 줄을 넣는다.
// 이미 읽어 둔 기록(appearances)으로 1위를 가려 DB를 더 읽지 않고, 이번 달 마지막 1위 알림의 주인과 다를 때만 쓴다.
// 1위를 빼앗긴 사람에게는 보내지 않는다. 같은 사람이 되찾으면 다시 보낸다.
export async function notifyRankLeaders({
  serverId,
  appearances,
  now,
}: {
  serverId: string;
  appearances: MonthlyAppearance[];
  now: Date;
}) {
  const month = kstMonthKey(now);
  for (const role of LEADER_ROLES) {
    const leader = monthLeader({ appearances, role, month });
    if (!leader) continue;
    const awardRole = role === BADGE_ROLE.gm ? MONTHLY_AWARD_ROLE.gm : MONTHLY_AWARD_ROLE.pl;
    await db.transaction(async (tx) => {
      // 같은 서버·역할의 동시 재계산이 알림을 두 번 넣지 않게 직렬화한다.
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`rank_leader:${serverId}:${awardRole}`}))`,
      );
      const [last] = await tx
        .select({ userId: notifications.userId })
        .from(notifications)
        .where(
          and(
            eq(notifications.serverId, serverId),
            eq(notifications.kind, NOTIFICATION_KIND.rankLeader),
            gte(notifications.createdAt, startOfKstMonth(now)),
            sql`${notifications.params}->>'role' = ${awardRole}`,
          ),
        )
        .orderBy(desc(notifications.createdAt))
        .limit(1);
      if (last?.userId === leader) return;
      await createNotifications({
        executor: tx,
        serverId,
        actorId: null,
        notifications: [
          {
            userId: leader,
            kind: NOTIFICATION_KIND.rankLeader,
            params: { month: Number(month.slice(5)), role: awardRole },
          },
        ],
      });
    });
  }
}
