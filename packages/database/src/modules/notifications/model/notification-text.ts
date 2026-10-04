import { isNull } from "es-toolkit";

import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";

import { directionalParticle } from "./directional-particle";
import { formatMonthDay } from "./format-month-day";
import { formatMonthDayTime } from "./format-month-day-time";
import { formatSessionDateTime } from "./format-session-date-time";
import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
  type NotificationPayload,
} from "./notification-kind";
import { objectParticle } from "./object-particle";
import { subjectParticle } from "./subject-particle";
import { topicParticle } from "./topic-particle";

export interface NotificationText {
  pre: string;
  strong: string | null;
  post: string;
  sub: string | null;
}

// 줄은 pre + strong(굵게) + post, sub는 흐린 보조 줄이다. 웹 알림 줄과 어드민 미리보기가 함께 쓴다.
export function notificationText(payload: NotificationPayload): NotificationText {
  const bold = (strong: string, post: string, sub: string | null = null, pre = "") => ({
    pre,
    strong,
    post,
    sub,
  });
  const plain = (pre: string, sub: string | null = null) => ({ pre, strong: null, post: "", sub });

  switch (payload.kind) {
    case NOTIFICATION_KIND.participationConfirmed:
      return bold(payload.params.gameTitle, " 참여가 확정되었습니다.");
    case NOTIFICATION_KIND.movedToWaitlist:
      return bold(
        payload.params.gameTitle,
        "에서 대기로 옮겨졌습니다.",
        `대기 ${payload.params.waitlistRank}번`,
      );
    case NOTIFICATION_KIND.removedFromRoster:
      return bold(payload.params.gameTitle, " 참여 목록에서 제외되었습니다.");
    case NOTIFICATION_KIND.seatOpened:
      return bold(
        payload.params.gameTitle,
        "에 빈자리가 생겼습니다.",
        "GM이 대기 명단에서 확정합니다.",
      );
    case NOTIFICATION_KIND.participantLeft:
      return bold(
        payload.params.gameTitle,
        " 참여를 취소했습니다.",
        null,
        `${payload.params.nickname}님이 `,
      );
    case NOTIFICATION_KIND.drawWon:
      return bold(payload.params.gameTitle, " 추첨에 뽑혔습니다.", "참여가 확정되었습니다.");
    case NOTIFICATION_KIND.drawWaitlisted:
      return bold(
        payload.params.gameTitle,
        ` 추첨 결과 대기 ${payload.params.waitlistRank}번입니다.`,
        "자리가 나면 GM이 대기 명단에서 확정합니다.",
      );
    case NOTIFICATION_KIND.recruitmentClosedEmpty:
      return bold(payload.params.gameTitle, " 신청자 없이 모집이 끝났습니다.");
    case NOTIFICATION_KIND.sessionTimeSet:
      return bold(
        payload.params.gameTitle,
        " 세션 시간이 정해졌습니다.",
        formatSessionDateTime(payload.params.startsAt),
      );
    case NOTIFICATION_KIND.sessionTimeChanged:
      return bold(
        payload.params.gameTitle,
        " 세션 시간이 바뀌었습니다.",
        `${formatMonthDayTime(payload.params.previousStartsAt)} → ${formatMonthDayTime(payload.params.startsAt)}`,
      );
    case NOTIFICATION_KIND.gameCancelled:
      return bold(
        payload.params.gameTitle,
        " 구인이 취소되었습니다.",
        cancelledSub(payload.params),
      );
    case NOTIFICATION_KIND.gameHidden:
      return bold(
        payload.params.gameTitle,
        `${objectParticle(payload.params.gameTitle)} 운영진이 숨겼습니다.`,
        `사유: ${payload.params.reason}`,
      );
    case NOTIFICATION_KIND.gameUnhidden:
      return bold(
        payload.params.gameTitle,
        `${subjectParticle(payload.params.gameTitle)} 다시 보입니다.`,
      );
    case NOTIFICATION_KIND.absenceRecorded:
      return bold(
        payload.params.gameTitle,
        " 세션에 불참으로 기록되었습니다.",
        "이의가 있으면 운영진에게 문의해 주세요.",
      );
    case NOTIFICATION_KIND.absenceAddedByStaff:
      return bold(
        payload.params.gameTitle,
        " 세션에 불참으로 기록되었습니다.",
        "운영진이 기록했습니다.",
      );
    case NOTIFICATION_KIND.absenceCancelled:
      return bold(payload.params.gameTitle, " 불참 기록이 취소되었습니다.");
    case NOTIFICATION_KIND.absenceRestored:
      return bold(payload.params.gameTitle, " 불참 기록이 다시 남았습니다.");
    case NOTIFICATION_KIND.attendanceAutoConfirmed:
      return bold(
        payload.params.gameTitle,
        " 출석이 자동으로 확정되었습니다.",
        "세션이 끝나고 7일이 지났습니다.",
      );
    case NOTIFICATION_KIND.reviewAvailable:
      return bold(payload.params.gameTitle, " 후기를 남길 수 있습니다.");
    case NOTIFICATION_KIND.certApproved:
      return bold(payload.params.rulebookName, " 인증이 승인되었습니다.");
    case NOTIFICATION_KIND.certRejected:
      return bold(
        payload.params.rulebookName,
        " 인증이 반려되었습니다.",
        payload.params.rejectionSummary,
      );
    case NOTIFICATION_KIND.certRevoked:
      return bold(
        payload.params.rulebookName,
        " 인증이 반려로 바뀌었습니다.",
        revokedSub(payload.params.cancelledGameCount),
      );
    case NOTIFICATION_KIND.certGranted:
      return bold(
        payload.params.rulebookName,
        " 인증이 등록되었습니다.",
        "운영진이 직접 등록했습니다.",
      );
    case NOTIFICATION_KIND.rulebookRequestAdded:
      return bold(
        payload.params.rulebookName,
        `${objectParticle(payload.params.rulebookName)} 추가했습니다.`,
        null,
        "요청한 ",
      );
    case NOTIFICATION_KIND.rulebookRequestDeclined:
      return bold(
        payload.params.rulebookName,
        `${topicParticle(payload.params.rulebookName)} 추가하지 않았습니다.`,
        null,
        "요청한 ",
      );
    case NOTIFICATION_KIND.reviewHidden:
      return bold(
        payload.params.gameTitle,
        " 후기를 운영진이 숨겼습니다.",
        `사유: ${payload.params.reason}`,
      );
    case NOTIFICATION_KIND.reviewUnhidden:
      return bold(payload.params.gameTitle, " 후기가 다시 보입니다.");
    case NOTIFICATION_KIND.reviewDeleted:
      return bold(
        payload.params.gameTitle,
        " 후기를 운영진이 삭제했습니다.",
        `사유: ${payload.params.reason}`,
      );
    case NOTIFICATION_KIND.sanctioned:
      return plain(
        "활동이 정지되었습니다.",
        `사유: ${payload.params.reason} · 기간: ${sanctionPeriod(payload.params.until)}`,
      );
    case NOTIFICATION_KIND.sanctionReleased:
      return plain("활동 정지가 풀렸습니다.");
    case NOTIFICATION_KIND.nicknameChanged:
      return bold(
        payload.params.nickname,
        `${directionalParticle(payload.params.nickname)} 바꿨습니다.`,
        `사유: ${payload.params.reason}`,
        "운영진이 닉네임을 ",
      );
    case NOTIFICATION_KIND.staffAdded:
      return plain("운영진이 되었습니다.");
    case NOTIFICATION_KIND.staffRemoved:
      return plain("운영진에서 빠졌습니다.");
    case NOTIFICATION_KIND.badgeEarned:
      return bold(
        payload.params.name,
        `${objectParticle(payload.params.name)} 받았습니다.`,
        payload.params.criterion,
        `새 업적 ${payload.params.emoji} `,
      );
    case NOTIFICATION_KIND.hiddenTitleEarned:
      return bold(
        payload.params.name,
        `${objectParticle(payload.params.name)} 받았습니다.`,
        payload.params.description,
        `새 업적 ${payload.params.emoji} `,
      );
    case NOTIFICATION_KIND.monthlyAward:
      return plain(
        payload.params.role === MONTHLY_AWARD_ROLE.gm
          ? `${payload.params.month}월의 GM으로 뽑혔습니다.`
          : `${payload.params.month}월의 PL로 뽑혔습니다.`,
      );
  }

  function cancelledSub({
    cancelKind,
    reason,
  }: {
    cancelKind: string;
    reason: string | null;
  }): string | null {
    if (cancelKind === GAME_CANCEL_KIND.staff) return "운영진이 취소했습니다.";
    if (cancelKind === GAME_CANCEL_KIND.auto) return "GM이 서버를 나가 취소되었습니다.";
    return reason ? `사유: ${reason}` : null;
  }

  function revokedSub(count: number) {
    return count >= 1 ? `열었던 구인 ${count}개가 함께 취소되었습니다.` : null;
  }

  function sanctionPeriod(until: string | null) {
    return isNull(until) ? "해제될 때까지" : `${formatMonthDay(until)}까지`;
  }
}
