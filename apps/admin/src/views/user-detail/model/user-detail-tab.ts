export const USER_DETAIL_TAB = {
  activity: "activity",
  cert: "cert",
  noShow: "noshow",
  memo: "memo",
} as const;
export type UserDetailTab = (typeof USER_DETAIL_TAB)[keyof typeof USER_DETAIL_TAB];
