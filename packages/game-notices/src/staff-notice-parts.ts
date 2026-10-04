import { formatDate } from "@roll-and-call/database/moderation/model";
import { DISCORD_COLOR } from "@roll-and-call/discord";
import { isNull } from "es-toolkit";

import { STAFF_NOTICE_KIND, type StaffNotice } from "./staff-notice-kind";

const SHOWN_NICKNAMES = 3;

interface StaffNoticeParts {
  title: string;
  target: string;
  path: string;
  color: number;
}

export function staffNoticeParts(notice: StaffNotice): StaffNoticeParts {
  switch (notice.kind) {
    case STAFF_NOTICE_KIND.certApplied:
      return {
        title: "새 룰북 인증 신청이 들어왔습니다",
        target: `${notice.applicantNickname} · ${notice.rulebookLabel}`,
        path: `/cert/${notice.applicationId}`,
        color: DISCORD_COLOR.recruit,
      };
    case STAFF_NOTICE_KIND.rulebookRequested:
      return {
        title: "새 룰북 추가 요청이 들어왔습니다",
        target: `${notice.requesterNickname} · ${[notice.name, notice.edition].filter(Boolean).join(" ")}`,
        path: "/rules?tab=requests",
        color: DISCORD_COLOR.recruit,
      };
    case STAFF_NOTICE_KIND.sanctioned:
      return {
        title: `${notice.staffNickname}님이 활동 정지를 확정했습니다`,
        target: `${notice.targetNickname} · ${isNull(notice.until) ? "해제될 때까지" : `${formatDate(notice.until)}까지`}`,
        path: `/users/${notice.targetUserId}`,
        color: DISCORD_COLOR.cancelled,
      };
    case STAFF_NOTICE_KIND.certRevoked:
      return {
        title: `${notice.staffNickname}님이 인증을 반려로 돌렸습니다`,
        target: [
          notice.targetNickname,
          notice.rulebookLabel,
          ...(notice.cancelledGameCount > 0 ? [`취소된 구인 ${notice.cancelledGameCount}개`] : []),
        ].join(" · "),
        path: `/cert/manage?user=${notice.targetUserId}`,
        color: DISCORD_COLOR.cancelled,
      };
    case STAFF_NOTICE_KIND.certGranted: {
      const hidden = notice.nicknames.length - SHOWN_NICKNAMES;
      const nicknames =
        notice.nicknames.length > SHOWN_NICKNAMES + 1
          ? `${notice.nicknames.slice(0, SHOWN_NICKNAMES).join(", ")} 외 ${hidden}명`
          : notice.nicknames.join(", ");
      return {
        title: `${notice.staffNickname}님이 인증을 부여했습니다`,
        target: `${notice.rulebookLabel} · ${nicknames}`,
        path: `/cert/manage?rulebook=${notice.rulebookId}`,
        color: DISCORD_COLOR.confirmed,
      };
    }
  }
}
