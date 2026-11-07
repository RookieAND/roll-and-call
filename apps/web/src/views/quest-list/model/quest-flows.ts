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

// 서비스 한눈에 보기의 두 흐름. 시안 21 v2(U17-14)의 칩 이름과 아이콘이다.
export const QUEST_FLOWS: readonly {
  track: OnboardingTrack;
  steps: readonly { label: string; icon: FlowIcon }[];
}[] = [
  {
    track: ONBOARDING_TRACK.join,
    steps: [
      { label: "구인 찾기", icon: FLOW_ICON.search },
      { label: "신청", icon: FLOW_ICON.apply },
      { label: "일정 조율", icon: FLOW_ICON.calendar },
      { label: "세션", icon: FLOW_ICON.users },
      { label: "후기", icon: FLOW_ICON.chat },
    ],
  },
  {
    track: ONBOARDING_TRACK.recruit,
    steps: [
      { label: "룰북 인증", icon: FLOW_ICON.book },
      { label: "구인 등록", icon: FLOW_ICON.flag },
      { label: "신청 받기", icon: FLOW_ICON.inbox },
      { label: "세션", icon: FLOW_ICON.users },
      { label: "출석 확인", icon: FLOW_ICON.check },
    ],
  },
];
