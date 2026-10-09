import {
  NOTIFICATION_KIND,
  type NotificationPayload,
} from "@roll-and-call/database/notifications/model";

// 서버 안 경로. 대상이 지워졌으면 그 화면의 없는 페이지가 그대로 보인다. null이면 읽음만 한다.
export function notificationHref(payload: NotificationPayload): string | null {
  switch (payload.kind) {
    case NOTIFICATION_KIND.participationConfirmed:
    case NOTIFICATION_KIND.movedToWaitlist:
    case NOTIFICATION_KIND.removedFromRoster:
    case NOTIFICATION_KIND.seatOpened:
    case NOTIFICATION_KIND.lotteryScheduleConfirmed:
    case NOTIFICATION_KIND.lotteryParticipationConfirmed:
    case NOTIFICATION_KIND.selectionScheduleConfirmed:
    case NOTIFICATION_KIND.selectionParticipationConfirmed:
    case NOTIFICATION_KIND.selectionWaitlisted:
    case NOTIFICATION_KIND.sessionTimeSet:
    case NOTIFICATION_KIND.sessionTimeChanged:
    case NOTIFICATION_KIND.gameCancelled:
    case NOTIFICATION_KIND.gameHidden:
    case NOTIFICATION_KIND.gameUnhidden:
    case NOTIFICATION_KIND.absenceRecorded:
    case NOTIFICATION_KIND.absenceAddedByStaff:
    case NOTIFICATION_KIND.absenceCancelled:
    case NOTIFICATION_KIND.absenceRestored:
    case NOTIFICATION_KIND.attendanceAutoConfirmed:
      return `/games/${payload.params.gameId}`;
    case NOTIFICATION_KIND.participantLeft:
      return `/games/${payload.params.gameId}/participants`;
    case NOTIFICATION_KIND.drawWon:
    case NOTIFICATION_KIND.drawWaitlisted:
      return `/games/${payload.params.gameId}/draw`;
    case NOTIFICATION_KIND.recruitmentClosedEmpty:
      return `/games/${payload.params.gameId}/manage`;
    case NOTIFICATION_KIND.reviewAvailable:
      return `/games/${payload.params.gameId}/review`;
    case NOTIFICATION_KIND.certApproved:
    case NOTIFICATION_KIND.certRejected:
    case NOTIFICATION_KIND.certRevoked:
      return `/me/rulebooks/${payload.params.rulebookId}`;
    case NOTIFICATION_KIND.certGranted:
    case NOTIFICATION_KIND.rulebookRequestAdded:
    case NOTIFICATION_KIND.rulebookRequestDeclined:
      return "/me/rulebooks";
    case NOTIFICATION_KIND.reviewHidden:
    case NOTIFICATION_KIND.reviewUnhidden:
    case NOTIFICATION_KIND.reviewDeleted:
      return "/me/reviews";
    case NOTIFICATION_KIND.sanctioned:
      return "/me";
    case NOTIFICATION_KIND.nicknameChanged:
      return "/me/edit";
    case NOTIFICATION_KIND.badgeEarned:
    case NOTIFICATION_KIND.hiddenTitleEarned:
    case NOTIFICATION_KIND.monthlyAward:
      return "/me/badges";
    case NOTIFICATION_KIND.sanctionReleased:
    case NOTIFICATION_KIND.staffAdded:
    case NOTIFICATION_KIND.staffRemoved:
      return null;
  }
}
