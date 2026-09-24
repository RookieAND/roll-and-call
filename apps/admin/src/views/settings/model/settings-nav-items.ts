export const SETTINGS_NAV_ITEMS = [
  { href: "/settings/staff", label: "운영진 관리" },
  { href: "/settings/cert-date", label: "룰북 인증 적용일" },
] as const;

export type SettingsHref = (typeof SETTINGS_NAV_ITEMS)[number]["href"];
