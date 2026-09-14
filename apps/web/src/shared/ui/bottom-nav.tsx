"use client";

import { cn, Text } from "@trpg/ui";
import { House, List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 활성 판정은 라우트 그룹 기준: 상세·조율·참여자 관리는 "구인 목록", 내 세션·프로필 편집은 "마이페이지".
const inGroup = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

const tabs = [
  { href: "/", label: "홈", Icon: House, isActive: (p: string) => p === "/" },
  { href: "/games", label: "구인 목록", Icon: List, isActive: (p: string) => inGroup(p, "/games") },
  { href: "/me", label: "마이페이지", Icon: User, isActive: (p: string) => inGroup(p, "/me") },
];

// 한 작업에 몰입하는 화면(구인 등록·수정 위저드, 일정 조율 격자)에서는 탭을 내리고 그 화면의 하단 CTA만 남긴다.
const IMMERSIVE = /^\/games\/(new|[^/]+\/(edit|schedule))$/;

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
              "flex flex-col items-center justify-center gap-1.5 transition-colors",
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
