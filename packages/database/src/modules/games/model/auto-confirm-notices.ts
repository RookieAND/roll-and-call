import { NOTIFICATION_KIND, type NotificationInput } from "#db/modules/notifications/model";

// 자동 확정은 GM에게만 알린다. 후기 알림은 종료 판정 시각이 지나면 notifyReviewAvailable가 보낸다.
export function autoConfirmNotices({
  game,
  notifyGm,
}: {
  game: { id: string; title: string; gmId: string };
  notifyGm: boolean;
}): NotificationInput[] {
  if (!notifyGm) return [];
  return [
    {
      userId: game.gmId,
      kind: NOTIFICATION_KIND.attendanceAutoConfirmed,
      params: { gameId: game.id, gameTitle: game.title },
    },
  ];
}
