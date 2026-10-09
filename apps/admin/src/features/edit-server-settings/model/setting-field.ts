// 화면 순서대로다.
export const SETTING_FIELDS = [
  {
    key: "recruitChannelId",
    label: "모집 포럼 채널 ID",
    auditLabel: "모집 포럼 채널",
    purpose: "새 구인 글이 올라옵니다",
  },
  {
    key: "closedChannelId",
    label: "완료 채널 ID",
    auditLabel: "완료 채널",
    purpose: "끝난 세션이 올라옵니다",
  },
  {
    key: "announceChannelId",
    label: "공지 채널 ID",
    auditLabel: "공지 채널",
    purpose: "서버 공지가 올라옵니다",
  },
  {
    key: "staffChannelId",
    label: "운영진 채널 ID",
    auditLabel: "운영진 채널",
    purpose: "처리 대기가 올라옵니다. 비워 둘 수 있습니다",
    emptyHint: "운영진 채널을 정하지 않으면 디스코드 글 없이 어드민에서만 처리 대기를 봅니다.",
  },
  { key: "reviewForumChannelId", label: "후기 채널 ID", auditLabel: "후기 채널" },
] as const;

export type SettingField = (typeof SETTING_FIELDS)[number];
export type SettingFieldKey = SettingField["key"];
export type SettingIds = Record<SettingFieldKey, string>;
