import { NOTIFICATION_KIND, type NotificationInput } from "#db/modules/notifications/model";

// 조기 종결 알림. 받는 사람마다 완주 여부가 다르다.
export function gameFinishedEarlyNotices({
  game,
  roster,
  reason,
  roundNo,
}: {
  game: { id: string; title: string };
  roster: readonly { userId: string; finisher: boolean }[];
  reason: "manual" | "stale";
  roundNo: number;
}): NotificationInput[] {
  return roster.map(({ userId, finisher }) => ({
    userId,
    kind: NOTIFICATION_KIND.gameFinishedEarly,
    params: { gameId: game.id, gameTitle: game.title, reason, roundNo, finisher },
  }));
}
