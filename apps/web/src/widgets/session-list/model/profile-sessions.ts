export const PROFILE_SESSION_TAB = {
  hosted: "hosted",
  upcoming: "upcoming",
  past: "past",
} as const;

export type ProfileSessionTab = (typeof PROFILE_SESSION_TAB)[keyof typeof PROFILE_SESSION_TAB];

export const PROFILE_SESSION_SECTIONS = [
  {
    key: PROFILE_SESSION_TAB.hosted,
    title: "진행한 세션",
    tabLabel: "진행",
    empty: "아직 GM으로 진행한 세션이 없습니다.",
  },
  {
    key: PROFILE_SESSION_TAB.upcoming,
    title: "참여 예정 세션",
    tabLabel: "참여 예정",
    empty: "참여 예정인 세션이 없습니다.",
  },
  {
    key: PROFILE_SESSION_TAB.past,
    title: "마감된 세션",
    tabLabel: "마감",
    empty: "마감된 세션이 없습니다.",
  },
] as const satisfies ReadonlyArray<{
  key: ProfileSessionTab;
  title: string;
  tabLabel: string;
  empty: string;
}>;
