export const USER_ACTION = {
  release: "release",
  memo: "memo",
} as const;
export type UserAction = (typeof USER_ACTION)[keyof typeof USER_ACTION];
