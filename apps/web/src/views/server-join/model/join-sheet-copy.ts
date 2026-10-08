import type { BadgeProps } from "@roll-and-call/ui";

import type { JoinScreenStatus } from "./join-screen-status";

interface JoinSheetCopy {
  badge: string;
  badgePalette: BadgeProps["colorPalette"];
  title: string;
  body: string[];
}

interface JoinSheetCopyInput {
  serverName: string;
  hasInvite: boolean;
}

export const JOIN_SHEET_COPY: Record<
  JoinScreenStatus,
  (input: JoinSheetCopyInput) => JoinSheetCopy
> = {
  signedOut: ({ serverName }) => ({
    badge: "로그인",
    badgePalette: "primary",
    title: `${serverName} 롤앤콜에 로그인해 주세요`,
    body: [
      "구인 신청과 일정 조율을 여기서 합니다.",
      `${serverName} 멤버라면 로그인만 하면 됩니다.`,
    ],
  }),
  checking: ({ serverName }) => ({
    badge: "확인 중",
    badgePalette: "gray",
    title: "서버 멤버인지 확인하고 있습니다",
    body: [`디스코드에서 ${serverName} 서버 정보를 받아 오는 중입니다.`],
  }),
  denied: ({ serverName, hasInvite }) => ({
    badge: "멤버 전용",
    badgePalette: "danger",
    title: "이 디스코드 서버의 멤버만 쓸 수 있습니다",
    body: [
      `로그인한 계정은 ${serverName} 서버에 들어가 있지 않습니다.`,
      ...(hasInvite ? [] : ["서버 운영진에게 초대를 요청해 주세요."]),
      "서버에 들어간 뒤 이 링크를 다시 열어 주세요.",
    ],
  }),
  failed: () => ({
    badge: "일시 오류",
    badgePalette: "warning",
    title: "지금은 서버 멤버인지 확인할 수 없습니다",
    body: ["잠시 후 다시 시도해 주세요."],
  }),
};
