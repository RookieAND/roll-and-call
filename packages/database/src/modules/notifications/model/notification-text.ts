import { formatDate, formatDateClock, formatDateTime } from "@roll-and-call/app-kit/date";
import {
  directionalParticle,
  objectParticle,
  subjectParticle,
  topicParticle,
} from "@roll-and-call/app-kit/lib";
import { isNull } from "es-toolkit";

import {
  GAME_CANCEL_KIND,
  MIN_PLAYERS_UNMET_CANCEL_TEXT,
  SELECTION_EXPIRED_CANCEL_TEXT,
} from "#db/modules/notifications/model/game-cancel-kind";

import { bookNames } from "./book-names";
import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
  type NotificationPayload,
} from "./notification-kind";
import { roundSpanText } from "./round-span-text";
import { shiftPhrase } from "./shift-phrase";

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
      return bold(
        payload.params.gameTitle,
        " 참여가 확정되었습니다.",
        "구인 글에서 세션 정보를 확인해 주세요.",
      );
    case NOTIFICATION_KIND.newGameJoined:
      return bold(payload.params.gameTitle, " 구인에 참여되었습니다.");
    case NOTIFICATION_KIND.movedToWaitlist:
      return bold(
        payload.params.gameTitle,
        "에서 대기로 옮겨졌습니다.",
        `현재 대기 ${payload.params.waitlistRank}번입니다.`,
      );
    case NOTIFICATION_KIND.removedFromRoster:
      return bold(
        payload.params.gameTitle,
        " 참여 목록에서 제외되었습니다.",
        "자세한 내용은 GM에게 문의해 주세요.",
      );
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
        "남은 자리를 확인해 주세요.",
        `${payload.params.nickname}님이 `,
      );
    case NOTIFICATION_KIND.drawWon:
      return bold(payload.params.gameTitle, " 추첨에 뽑혔습니다.", "참여가 확정되었습니다.");
    case NOTIFICATION_KIND.drawWaitlisted:
      return bold(
        payload.params.gameTitle,
        ` 추첨 결과 대기 ${payload.params.waitlistRank}번입니다.`,
        "자리가 나면 GM이 확정합니다.",
      );
    case NOTIFICATION_KIND.lotteryScheduleConfirmed:
      return bold(
        payload.params.gameTitle,
        " 일정이 확정되었습니다.",
        "구인 글에서 일정을 확인해 주세요.",
      );
    case NOTIFICATION_KIND.lotteryParticipationConfirmed:
      return bold(
        payload.params.gameTitle,
        " 참여가 확정되었습니다.",
        "GM과 일정을 조율해 주세요.",
      );
    case NOTIFICATION_KIND.selectionScheduleConfirmed:
      return bold(
        payload.params.gameTitle,
        " 일정이 확정되었습니다.",
        `세션 일시는 ${formatDateTime(payload.params.startsAt)}입니다.`,
      );
    case NOTIFICATION_KIND.selectionParticipationConfirmed:
      return bold(
        payload.params.gameTitle,
        " 참여가 확정되었습니다.",
        "GM이 세션 시간을 정하면 알려 드립니다.",
      );
    case NOTIFICATION_KIND.selectionWaitlisted:
      return bold(
        payload.params.gameTitle,
        ` 선발 결과 대기 ${payload.params.waitlistRank}번입니다.`,
        "자리가 나면 GM이 대기 명단에서 확정합니다.",
      );
    case NOTIFICATION_KIND.recruitmentClosedEmpty:
      return bold(
        payload.params.gameTitle,
        " 신청자 없이 모집이 끝났습니다.",
        "구인을 다시 올릴 수 있습니다.",
      );
    case NOTIFICATION_KIND.sessionTimeSet:
      return bold(
        payload.params.gameTitle,
        " 세션 시간이 정해졌습니다.",
        `${formatDateTime(payload.params.startsAt)}에 진행됩니다.`,
      );
    case NOTIFICATION_KIND.sessionTimeChanged:
      return bold(
        payload.params.gameTitle,
        " 세션 시간이 바뀌었습니다.",
        `${formatDateClock(payload.params.previousStartsAt)} → ${formatDateClock(payload.params.startsAt)}`,
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
        "운영진이 숨김을 풀었습니다.",
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
      return bold(
        payload.params.gameTitle,
        " 불참 기록이 취소되었습니다.",
        "불참 횟수에 포함되지 않습니다.",
      );
    case NOTIFICATION_KIND.absenceRestored:
      return bold(
        payload.params.gameTitle,
        " 불참 기록이 다시 남았습니다.",
        "운영진이 취소를 되돌렸습니다.",
      );
    case NOTIFICATION_KIND.roundSkipped:
      return bold(
        payload.params.gameTitle,
        ` ${payload.params.roundNo}회차가 생략되었습니다.`,
        "뒤 회차 번호가 하나씩 당겨졌습니다.",
      );
    case NOTIFICATION_KIND.roundCountChanged: {
      const { previousCount, nextCount } = payload.params;
      const direction = nextCount > previousCount ? "늘었습니다" : "줄었습니다";
      return bold(
        payload.params.gameTitle,
        " 예정 회차 수가 바뀌었습니다.",
        `총 ${previousCount}회에서 ${nextCount}회로 ${direction}.`,
      );
    }
    case NOTIFICATION_KIND.gameFinishedEarly: {
      const { reason, roundNo, finisher } = payload.params;
      const cause =
        reason === "stale"
          ? "다음 회차가 30일 동안 정해지지 않아 마무리되었습니다."
          : `GM이 ${roundNo}회차에서 마쳤습니다.`;
      return bold(
        payload.params.gameTitle,
        " 구인이 일찍 마무리되었습니다.",
        finisher ? `${cause} 완주로 인정되었습니다.` : cause,
      );
    }
    case NOTIFICATION_KIND.roundAvailabilityRequested:
      return plain(
        `${payload.params.roundNo}회차 가능 시간을 알려 주세요`,
        payload.params.gameTitle,
      );
    case NOTIFICATION_KIND.roundScheduleSet:
      return plain(
        `${payload.params.roundNo}회차 일정이 정해졌습니다`,
        roundSpanText(payload.params),
      );
    case NOTIFICATION_KIND.roundScheduleChanged:
      return plain(
        `${payload.params.roundNo}회차 일정이 바뀌었습니다`,
        `${roundSpanText(payload.params)}로 옮겨졌습니다`,
      );
    case NOTIFICATION_KIND.laterRoundsChanged: {
      const { fromRoundNo, toRoundNo, shiftMs } = payload.params;
      const range =
        fromRoundNo === toRoundNo ? `${fromRoundNo}회차` : `${fromRoundNo}~${toRoundNo}회차`;
      return plain(
        "이후 회차 일정이 바뀌었습니다",
        `${range}가 ${shiftPhrase(shiftMs)} 옮겨졌습니다`,
      );
    }
    case NOTIFICATION_KIND.attendanceAutoConfirmed:
      return bold(
        payload.params.gameTitle,
        " 출석이 자동으로 확정되었습니다.",
        "세션이 끝나고 24시간이 지났습니다.",
      );
    case NOTIFICATION_KIND.reviewAvailable:
      return bold(
        payload.params.gameTitle,
        " 후기를 남길 수 있습니다.",
        "함께한 세션의 후기를 남겨 주세요.",
      );
    case NOTIFICATION_KIND.sessionReminder:
      return payload.params.roundNo
        ? bold(payload.params.gameTitle, ` ${payload.params.roundNo}회차 시작 1시간 전입니다.`)
        : bold(payload.params.gameTitle, " 세션이 1시간 뒤에 시작됩니다.");
    case NOTIFICATION_KIND.sessionStarted:
      return payload.params.roundNo
        ? bold(payload.params.gameTitle, ` ${payload.params.roundNo}회차가 시작되었습니다.`)
        : bold(payload.params.gameTitle, " 세션이 시작되었습니다.");
    case NOTIFICATION_KIND.certApproved:
      return bold(
        bookNames(payload.params),
        " 인증이 승인되었습니다.",
        "내 인증 목록에서 확인할 수 있습니다.",
      );
    case NOTIFICATION_KIND.certRejected:
      return bold(
        bookNames(payload.params),
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
        bookNames(payload.params),
        " 인증이 등록되었습니다.",
        "운영진이 직접 등록했습니다.",
      );
    case NOTIFICATION_KIND.rulebookRequestAdded:
      return bold(
        payload.params.rulebookName,
        `${objectParticle(payload.params.rulebookName)} 추가했습니다.`,
        "이제 구인에서 선택할 수 있습니다.",
        "요청한 ",
      );
    case NOTIFICATION_KIND.rulebookRequestDeclined:
      return bold(
        payload.params.rulebookName,
        `${topicParticle(payload.params.rulebookName)} 추가하지 않았습니다.`,
        "자세한 내용은 운영진에게 문의해 주세요.",
        "요청한 ",
      );
    case NOTIFICATION_KIND.homebrewApproved:
      return bold(payload.params.ruleName, " 내가 만든 룰이 승인되었습니다.");
    case NOTIFICATION_KIND.homebrewRejected:
      return bold(payload.params.ruleName, " 내가 만든 룰 신청이 반려되었습니다.");
    case NOTIFICATION_KIND.reviewHidden:
      return bold(
        payload.params.gameTitle,
        " 후기를 운영진이 숨겼습니다.",
        `사유: ${payload.params.reason}`,
      );
    case NOTIFICATION_KIND.reviewUnhidden:
      return bold(
        payload.params.gameTitle,
        " 후기가 다시 보입니다.",
        "운영진이 숨김을 풀었습니다.",
      );
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
      return plain("활동 정지가 풀렸습니다.", "이제 다시 참여할 수 있습니다.");
    case NOTIFICATION_KIND.nicknameChanged:
      return bold(
        payload.params.nickname,
        `${directionalParticle(payload.params.nickname)} 바꿨습니다.`,
        `사유: ${payload.params.reason}`,
        "운영진이 닉네임을 ",
      );
    case NOTIFICATION_KIND.staffAdded:
      return plain("운영진이 되었습니다.", "운영 메뉴를 사용할 수 있습니다.");
    case NOTIFICATION_KIND.staffRemoved:
      return plain("운영진에서 빠졌습니다.", "운영 권한이 해제되었습니다.");
    case NOTIFICATION_KIND.badgeEarned:
      return bold(
        payload.params.name,
        `${objectParticle(payload.params.name)} 받았습니다.`,
        `조건: ${payload.params.criterion}`,
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
        `${payload.params.month}월 활약을 인정받았습니다.`,
      );
    case NOTIFICATION_KIND.rankLeader: {
      const { month, role, unit } = payload.params;
      const roleLabel = role === MONTHLY_AWARD_ROLE.gm ? "GM" : "PL";
      return plain(
        `${month}월 ${roleLabel} ${unit === "count" ? "참여 횟수" : "점수"} 1위가 되었습니다.`,
        "달이 끝날 때까지 순위가 바뀔 수 있습니다.",
      );
    }
  }

  function cancelledSub({
    cancelKind,
    reason,
  }: {
    cancelKind: string;
    reason: string | null;
  }): string {
    if (cancelKind === GAME_CANCEL_KIND.staff) return "운영진이 취소했습니다.";
    if (cancelKind === GAME_CANCEL_KIND.auto) return "GM이 서버를 나가 취소되었습니다.";
    if (cancelKind === GAME_CANCEL_KIND.minPlayersUnmet) return MIN_PLAYERS_UNMET_CANCEL_TEXT;
    if (cancelKind === GAME_CANCEL_KIND.selectionExpired) {
      return `사유: ${SELECTION_EXPIRED_CANCEL_TEXT}`;
    }
    return reason ? `사유: ${reason}` : "GM이 취소했습니다.";
  }

  function revokedSub(count: number) {
    return count >= 1 ? `구인 ${count}개도 함께 취소되었습니다.` : null;
  }

  function sanctionPeriod(until: string | null) {
    return isNull(until) ? "해제될 때까지" : `${formatDate(until)}까지`;
  }
}
