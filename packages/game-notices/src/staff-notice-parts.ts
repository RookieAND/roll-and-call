import { formatDate } from "@roll-and-call/database/moderation/model";
import { DISCORD_COLOR, type DiscordEmbed, type DiscordEmbedField } from "@roll-and-call/discord";
import { isNull } from "es-toolkit";

import { STAFF_NOTICE_KIND, type StaffNotice } from "./staff-notice-kind";

const SHOWN_NICKNAMES = 3;

interface StaffNoticeParts {
  title: string;
  thumbnail?: DiscordEmbed["thumbnail"];
  description?: string;
  fields: DiscordEmbedField[];
  path: string;
  color: number;
}

export function staffNoticeParts(notice: StaffNotice): StaffNoticeParts {
  switch (notice.kind) {
    case STAFF_NOTICE_KIND.certApplied:
      return {
        title: "새 룰북 인증 신청이 들어왔습니다",
        fields: [
          { name: "📋 항목", value: "룰북 인증 신청", inline: true },
          { name: "🙋 신청자", value: `<@${notice.applicantDiscordId}>`, inline: true },
          { name: "📖 룰북", value: notice.rulebookLabel, inline: true },
          { name: "🧾 인증 방식", value: notice.formatLabel, inline: true },
        ],
        description:
          "새로운 룰북 인증 신청이 들어왔습니다.\n제출한 자료를 확인하고 승인할지 반려할지 결정해 주세요.",
        thumbnail: notice.applicantAvatarUrl ? { url: notice.applicantAvatarUrl } : undefined,
        path: `/cert/${notice.applicationId}`,
        color: DISCORD_COLOR.recruit,
      };
    case STAFF_NOTICE_KIND.rulebookRequested:
      return {
        title: "새 룰북 추가 요청이 들어왔습니다",
        fields: [
          { name: "📋 항목", value: "룰북 추가 요청", inline: true },
          { name: "🙋 요청자", value: `<@${notice.requesterDiscordId}>`, inline: true },
          {
            name: "📖 룰북",
            value: [notice.name, notice.edition].filter(Boolean).join(" "),
            inline: true,
          },
          ...(notice.kindLabel ? [{ name: "🏷️ 종류", value: notice.kindLabel, inline: true }] : []),
          ...(notice.category ? [{ name: "🗂️ 분류", value: notice.category, inline: true }] : []),
        ],
        description: [
          "새로운 룰북 신청이 들어왔습니다.\n기존 룰북과 비교해서 추가할지 반려할지 결정해 주세요.",
          ...(notice.link ? [`🔗 참고 링크\n${notice.link}`] : []),
        ].join("\n\n"),
        thumbnail: notice.requesterAvatarUrl ? { url: notice.requesterAvatarUrl } : undefined,
        path: "/rules?tab=requests",
        color: DISCORD_COLOR.recruit,
      };
    case STAFF_NOTICE_KIND.sanctioned:
      return {
        title: `${notice.staffNickname}님이 활동 정지를 확정했습니다`,
        fields: [
          { name: "🚫 대상", value: notice.targetNickname, inline: true },
          {
            name: "⏳ 기한",
            value: isNull(notice.until) ? "해제될 때까지" : `${formatDate(notice.until)}까지`,
            inline: true,
          },
        ],
        path: `/users/${notice.targetUserId}`,
        color: DISCORD_COLOR.cancelled,
      };
    case STAFF_NOTICE_KIND.certRevoked:
      return {
        title: `${notice.staffNickname}님이 인증을 반려로 돌렸습니다`,
        fields: [
          { name: "🙅 대상", value: notice.targetNickname, inline: true },
          { name: "📖 룰북", value: notice.rulebookLabel, inline: true },
          ...(notice.cancelledGameCount > 0
            ? [{ name: "🗑️ 취소된 구인", value: `${notice.cancelledGameCount}개`, inline: true }]
            : []),
        ],
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
        fields: [
          { name: "📖 룰북", value: notice.rulebookLabel, inline: true },
          { name: "🎖️ 대상", value: nicknames, inline: true },
        ],
        path: `/cert/manage?rulebook=${notice.rulebookId}`,
        color: DISCORD_COLOR.confirmed,
      };
    }
  }
}
