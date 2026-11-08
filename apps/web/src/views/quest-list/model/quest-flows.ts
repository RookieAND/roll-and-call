import { ONBOARDING_TRACK, type OnboardingTrack } from "@roll-and-call/database/onboarding/model";

export const FLOW_ICON = {
  search: "search",
  apply: "apply",
  calendar: "calendar",
  users: "users",
  chat: "chat",
  book: "book",
  flag: "flag",
  inbox: "inbox",
  check: "check",
} as const;
export type FlowIcon = (typeof FLOW_ICON)[keyof typeof FLOW_ICON];

// 서비스 한눈에 보기의 두 흐름. 시안 07-4(U17-14)의 이름·아이콘·설명이다.
export const QUEST_FLOWS: readonly {
  track: OnboardingTrack;
  steps: readonly { label: string; icon: FlowIcon; description: string }[];
}[] = [
  {
    track: ONBOARDING_TRACK.join,
    steps: [
      {
        label: "구인 찾기",
        icon: FLOW_ICON.search,
        description: "구인 목록에서 시스템과 일정을 보고 고릅니다.",
      },
      { label: "신청", icon: FLOW_ICON.apply, description: "선착순이나 추첨으로 신청합니다." },
      {
        label: "일정 조율",
        icon: FLOW_ICON.calendar,
        description: "가능한 시간을 내면 GM이 세션 시간을 정합니다.",
      },
      { label: "세션", icon: FLOW_ICON.users, description: "정해진 시간에 함께 플레이합니다." },
      { label: "후기", icon: FLOW_ICON.chat, description: "세션이 끝난 뒤 후기를 남깁니다." },
    ],
  },
  {
    track: ONBOARDING_TRACK.recruit,
    steps: [
      {
        label: "룰북 인증",
        icon: FLOW_ICON.book,
        description: "가지고 있는 룰북을 인증하면 구인을 열 수 있습니다.",
      },
      {
        label: "구인 등록",
        icon: FLOW_ICON.flag,
        description: "시스템, 정원, 모집 방법을 정해 올립니다.",
      },
      { label: "신청 받기", icon: FLOW_ICON.inbox, description: "신청자를 확정하거나 추첨합니다." },
      { label: "세션", icon: FLOW_ICON.users, description: "확정된 일정에 세션을 진행합니다." },
      {
        label: "출석 확인",
        icon: FLOW_ICON.check,
        description: "세션이 끝나면 참여한 사람을 확인합니다.",
      },
    ],
  },
];
