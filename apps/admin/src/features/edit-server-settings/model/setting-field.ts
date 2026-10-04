// 화면 순서대로다.
export const SETTING_FIELDS = [
  { key: "recruitChannelId", label: "모집 포럼 채널 ID", auditLabel: "모집 포럼 채널" },
  { key: "closedChannelId", label: "완료 채널 ID", auditLabel: "완료 채널" },
  { key: "announceChannelId", label: "공지 채널 ID", auditLabel: "공지 채널" },
  {
    key: "staffChannelId",
    label: "운영진 채널 ID",
    auditLabel: "운영진 채널",
    emptyHint: "운영진 채널을 정하지 않으면 디스코드 글 없이 어드민에서만 처리 대기를 봅니다.",
  },
  { key: "reviewForumChannelId", label: "후기 포럼 채널 ID", auditLabel: "후기 포럼 채널" },
  { key: "gmRoleId", label: "GM 역할 ID", auditLabel: "GM 역할" },
] as const;

export type SettingField = (typeof SETTING_FIELDS)[number];
export type SettingFieldKey = SettingField["key"];
export type SettingIds = Record<SettingFieldKey, string>;
