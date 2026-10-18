import { createNotifications } from "#db/modules/notifications";
import type { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import type { Transaction } from "#db/modules/transaction";

type NoShowKind =
  | typeof NOTIFICATION_KIND.absenceAddedByStaff
  | typeof NOTIFICATION_KIND.absenceCancelled
  | typeof NOTIFICATION_KIND.absenceRestored;

export const NO_SHOW_NOTIFIED = "당사자·GM 알림 탭에 알림 보냄";

// 불참 기록이 바뀌면 당사자와 그 구인의 GM에게 알린다. 사유는 넣지 않는다(R10).
export async function notifyNoShowParties({
  tx,
  serverId,
  actorId,
  kind,
  gameId,
  gameTitle,
  userId,
  gmId,
}: {
  tx: Transaction;
  serverId: string;
  actorId: string;
  kind: NoShowKind;
  gameId: string;
  gameTitle: string;
  userId: string;
  gmId: string;
}) {
  await createNotifications({
    executor: tx,
    serverId,
    actorId,
    notifications: [userId, gmId].map((recipient) => ({
      userId: recipient,
      kind,
      params: { gameId, gameTitle },
    })),
  });
}
