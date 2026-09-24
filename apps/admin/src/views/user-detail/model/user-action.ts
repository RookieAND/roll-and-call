export const USER_ACTION = {
  sanction: "sanction",
  release: "release",
  revoke: "revoke",
  memo: "memo",
} as const;
export type UserAction = (typeof USER_ACTION)[keyof typeof USER_ACTION];
