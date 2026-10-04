import { isNil } from "es-toolkit";

import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "#/modules/notifications/model/notification-kind";

import type { AttendanceChanges } from "./attendance-changes";
import { isAttendingRow } from "./is-attending-row";

type NoticeRow = { userId: string; absent: boolean; absenceCancelledAt: Date | string | null };

// GM이 출석을 확정할 때 명단(확정 참여자)에게 가는 알림. 운영진이 취소한 불참은 불참 기록·취소를 알리지 않는다.
// 후기 알림은 처음 확정이면 참석자 전원, 다시 확정이면 불참에서 참석으로 바뀐 사람만 받는다.
export function gmAttendanceNotices({
  game,
  rows,
  changes,
  firstConfirmation,
}: {
  game: { id: string; title: string };
  rows: readonly NoticeRow[];
  changes: AttendanceChanges;
  firstConfirmation: boolean;
}): NotificationInput[] {
  const params = { gameId: game.id, gameTitle: game.title };
  const byUserId = new Map(rows.map((row) => [row.userId, row]));
  const staffCancelled = (userId: string) => !isNil(byUserId.get(userId)?.absenceCancelledAt);
  const attending = (userId: string) => {
    const row = byUserId.get(userId);
    return !isNil(row) && isAttendingRow(row);
  };
  const reviewers = firstConfirmation
    ? rows.filter(isAttendingRow).map((row) => row.userId)
    : changes.newlyPresent.filter(attending);

  return [
    ...changes.newlyAbsent
      .filter((userId) => !staffCancelled(userId))
      .map((userId) => ({ userId, kind: NOTIFICATION_KIND.absenceRecorded, params })),
    ...changes.newlyPresent
      .filter((userId) => !staffCancelled(userId))
      .map((userId) => ({ userId, kind: NOTIFICATION_KIND.absenceCancelled, params })),
    ...reviewers.map((userId) => ({ userId, kind: NOTIFICATION_KIND.reviewAvailable, params })),
  ];
}
