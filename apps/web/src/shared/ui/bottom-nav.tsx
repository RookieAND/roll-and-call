"use client";

import { cn, Text } from "@trpg/ui";
import { CalendarDays, List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isInRouteGroup } from "./is-in-route-group";

const tabs = [
  { href: "/", label: "홈", Icon: CalendarDays, isActive: (pathname: string) => pathname === "/" },
  {
    href: "/games",
    label: "구인 목록",
    Icon: List,
    isActive: (pathname: string) => isInRouteGroup(pathname, "/games"),
  },
  {
    href: "/me",
    label: "마이페이지",
    Icon: User,
    isActive: (pathname: string) => isInRouteGroup(pathname, "/me"),
  },
];

// 몰입 화면(등록·수정 위저드, 일정 조율)은 탭을 내리고 그 화면의 하단 CTA만 남긴다.
const IMMERSIVE = /^\/onboarding$|^\/games\/(new|[^/]+\/(edit|schedule|confirm))$/;

export function BottomNav() {
  const pathname = usePathname();
  if (IMMERSIVE.test(pathname)) return null;

  return (
    <nav className="sticky bottom-0 z-20 grid h-[58px] grid-cols-3 border-t border-gray-200 bg-surface">
      {tabs.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-075 transition-colors",
              active ? "text-primary-600" : "text-hint",
            )}
          >
            <tab.Icon size={18} aria-hidden />
            <Text typography="subtitle2" foreground={active ? "primary" : "hint"} render={<span />}>
              {tab.label}
            </Text>
          </Link>
        );
      })}
    </nav>
  );
}
