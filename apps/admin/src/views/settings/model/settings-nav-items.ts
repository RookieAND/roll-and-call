export const SETTINGS_NAV_ITEMS = [
  { href: "/settings/server", label: "서버 설정" },
  { href: "/settings/messages", label: "디스코드 메시지" },
  { href: "/settings/staff", label: "운영진 관리" },
] as const;

export type SettingsHref = (typeof SETTINGS_NAV_ITEMS)[number]["href"];
