import {
  NOTIFICATION_KIND,
  type NotificationInput,
} from "#/modules/notifications/model/notification-kind";

import { isAttendingRow } from "./is-attending-row";
import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";

// 자동 확정은 결과를 덮지 않는다. 내보낸 사람(removed)은 불참으로 남아 후기 알림을 받지 않는다.
export function autoConfirmNotices({
  game,
  rows,
  notifyGm,
}: {
  game: { id: string; title: string; gmId: string };
  rows: readonly {
    userId: string;
    status: ParticipantStatus;
    absent: boolean;
    absenceCancelledAt: Date | string | null;
  }[];
  notifyGm: boolean;
}): NotificationInput[] {
  const params = { gameId: game.id, gameTitle: game.title };
  const reviewers = rows.filter(
    (row) => row.status === PARTICIPANT_STATUS.confirmed && isAttendingRow(row),
  );
  const notices: NotificationInput[] = reviewers.map((row) => ({
    userId: row.userId,
    kind: NOTIFICATION_KIND.reviewAvailable,
    params,
  }));
  if (notifyGm) {
    notices.unshift({ userId: game.gmId, kind: NOTIFICATION_KIND.attendanceAutoConfirmed, params });
  }
  return notices;
}
