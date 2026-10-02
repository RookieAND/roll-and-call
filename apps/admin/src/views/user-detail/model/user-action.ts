export const USER_ACTION = {
  release: "release",
  memo: "memo",
  nickname: "nickname",
  kick: "kick",
  unban: "unban",
} as const;
export type UserAction = (typeof USER_ACTION)[keyof typeof USER_ACTION];
