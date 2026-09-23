"use client";

import { Grid } from "@roll-and-call/ui";
import { CalendarDays, List, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { ActiveBottomNavTab } from "./active-bottom-nav-tab";
import { BottomNavTab } from "./bottom-nav-tab";
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

// 몰입 화면(상세·등록·수정·조율 등 하단 CTA가 있는 곳)은 탭을 숨기고 FloatingBar만 남긴다.
const IMMERSIVE = /^\/onboarding$|^\/games\/(new$|[^/]+)/;

interface BottomNavProps {
  hasTodo: boolean;
}

export function BottomNav({ hasTodo }: BottomNavProps) {
  const pathname = usePathname();
  if (IMMERSIVE.test(pathname)) return null;

  return (
    <Grid
      cols={3}
      render={<nav />}
      className="sticky bottom-0 z-(--rc-z-sticky) h-(--rc-size-tabbar) border-t border-gray-200 bg-surface"
    >
      {tabs.map(({ href, label, Icon, isActive }) => {
        const Tab = isActive(pathname) ? ActiveBottomNavTab : BottomNavTab;
        return (
          <Tab key={href} href={href} label={label} Icon={Icon} dot={href === "/me" && hasTodo} />
        );
      })}
    </Grid>
  );
}
