import { isNil } from "es-toolkit";

import { NOTIFICATION_KIND, type NotificationInput } from "#db/modules/notifications/model";

import type { AttendanceChanges } from "./attendance-changes";

type NoticeRow = { userId: string; absent: boolean; absenceCancelledAt: Date | string | null };

// GM이 출석을 확정할 때 명단(확정 참여자)에게 가는 알림. 운영진이 취소한 불참은 불참 기록·취소를 알리지 않는다.
// 후기 알림은 여기서 보내지 않는다. 종료 판정 시각이 지나면 notifyReviewAvailable가 보낸다.
export function gmAttendanceNotices({
  game,
  rows,
  changes,
}: {
  game: { id: string; title: string };
  rows: readonly NoticeRow[];
  changes: AttendanceChanges;
}): NotificationInput[] {
  const params = { gameId: game.id, gameTitle: game.title };
  const byUserId = new Map(rows.map((row) => [row.userId, row]));
  const staffCancelled = (userId: string) => !isNil(byUserId.get(userId)?.absenceCancelledAt);

  return [
    ...changes.newlyAbsent
      .filter((userId) => !staffCancelled(userId))
      .map((userId) => ({ userId, kind: NOTIFICATION_KIND.absenceRecorded, params })),
    ...changes.newlyPresent
      .filter((userId) => !staffCancelled(userId))
      .map((userId) => ({ userId, kind: NOTIFICATION_KIND.absenceCancelled, params })),
  ];
}
