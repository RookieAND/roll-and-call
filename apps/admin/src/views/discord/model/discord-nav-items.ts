export const DISCORD_NAV_ITEMS = [
  { href: "/discord/link", label: "디스코드 연동" },
  { href: "/discord/messages", label: "디스코드 메시지" },
  { href: "/discord/tags", label: "포럼 태그" },
] as const;

export type DiscordHref = (typeof DISCORD_NAV_ITEMS)[number]["href"];
