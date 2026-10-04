export const SETTING_FAIL_REASON = {
  notInServer: "not-in-server",
  wrongType: "wrong-type",
  cannotPost: "cannot-post",
  unreachable: "unreachable",
} as const;

export type SettingFailReason = (typeof SETTING_FAIL_REASON)[keyof typeof SETTING_FAIL_REASON];

export const SETTING_TARGET_KIND = { channel: "channel", forum: "forum" } as const;

export type SettingTargetKind = (typeof SETTING_TARGET_KIND)[keyof typeof SETTING_TARGET_KIND];

export type SettingCheck =
  | { status: "ok"; kind: SettingTargetKind; name: string }
  | { status: "fail"; reason: SettingFailReason };
