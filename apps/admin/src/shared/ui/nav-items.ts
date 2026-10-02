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
  { key: "rules", label: "룰북", href: "/rules", icon: BookOpen },
  { key: "noshow", label: "불참 기록", href: "/noshow", icon: Flag },
  { key: "analytics", label: "분석", href: "/analytics", icon: ChartColumn },
  { key: "log", label: "활동 기록", href: "/log", icon: ScrollText },
  { key: "settings", label: "설정", href: "/settings", icon: Settings, ownerOnly: true },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
