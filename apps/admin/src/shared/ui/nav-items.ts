import {
  BookOpen,
  ChartColumn,
  Dices,
  Flag,
  House,
  ScrollText,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

export const NAV_ITEMS = [
  { key: "home", label: "홈", href: "/", icon: House },
  { key: "users", label: "유저", href: "/users", icon: User },
  { key: "posts", label: "구인", href: "/posts", icon: Dices },
  { key: "cert", label: "룰북 인증", href: "/cert", icon: ShieldCheck },
  { key: "noshow", label: "불참 기록", href: "/noshow", icon: Flag },
  { key: "analytics", label: "분석", href: "/analytics", icon: ChartColumn },
  { key: "log", label: "활동 기록", href: "/log", icon: ScrollText },
  { key: "settings", label: "설정", href: "/settings", icon: Settings, ownerOnly: true },
] as const;

// 서버 밖(전역) 메뉴. 플랫폼 관리자에게만 보인다.
export const PLATFORM_NAV_ITEMS = [
  { key: "catalog", label: "룰북 카탈로그", href: "/platform/catalog", icon: BookOpen },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
