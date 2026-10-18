import { db } from "#db/client";
import type { Actor } from "#db/modules/audit";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";

interface NotifyCertGroupDecisionInput {
  serverId: string;
  actor: Actor;
  userId: string;
  rulebookId: string;
  rulebookName: string;
  otherCount: number;
  // 반려면 요약을, 승인이면 null을 준다.
  rejectionSummary: string | null;
}

// 묶음 신청의 승인·반려는 책마다 알림을 보내지 않고 방향마다 「첫 책 외 N권」 한 건만 보낸다.
export async function notifyCertGroupDecision({
  serverId,
  actor,
  userId,
  rulebookId,
  rulebookName,
  otherCount,
  rejectionSummary,
}: NotifyCertGroupDecisionInput) {
  const params = { rulebookId, rulebookName, otherCount };
  await createNotifications({
    executor: db,
    serverId,
    actorId: actor.id,
    notifications: [
      rejectionSummary === null
        ? { userId, kind: NOTIFICATION_KIND.certApproved, params }
        : { userId, kind: NOTIFICATION_KIND.certRejected, params: { ...params, rejectionSummary } },
    ],
  });
}
