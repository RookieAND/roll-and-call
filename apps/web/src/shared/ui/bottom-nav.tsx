"use client";

import { Grid } from "@roll-and-call/ui";
import { Bell, CalendarDays, List, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { serverPath } from "@/shared/lib";

import { ActiveBottomNavTab } from "./active-bottom-nav-tab";
import { BottomNavTab } from "./bottom-nav-tab";
import { isInRouteGroup } from "./is-in-route-group";

// 점에는 숫자를 넣지 않는다. 홈은 막힌 할 일(세션 일시 미정), 알림은 이 서버의 안 읽은 알림.
const tabs = [
  { path: "/", label: "홈", Icon: CalendarDays, dot: { key: "home", label: "막힌 할 일 있음" } },
  { path: "/games", label: "구인 목록", Icon: List, dot: null },
  {
    path: "/notifications",
    label: "알림",
    Icon: Bell,
    dot: { key: "notifications", label: "안 읽은 알림 있음" },
  },
  { path: "/me", label: "마이페이지", Icon: User, dot: null },
] as const;

// 몰입 화면(상세·등록·수정·조율 등 하단 CTA가 있는 곳)과 가입·welcome은 탭을 숨긴다. 서버 slug 뒤의 경로로 본다.
const IMMERSIVE = /^\/(games\/(new$|[^/]+)|join$|welcome$)/;

interface BottomNavProps {
  slug: string;
  dots: { home: boolean; notifications: boolean };
}

export function BottomNav({ slug, dots }: BottomNavProps) {
  const serverHome = serverPath({ slug, path: "/" });
  const pathname = usePathname().slice(serverHome.length) || "/";
  if (IMMERSIVE.test(pathname)) return null;

  return (
    <Grid
      cols={4}
      render={<nav aria-label="주요 메뉴" />}
      className="sticky bottom-0 z-(--rc-z-sticky) h-(--rc-size-tabbar) border-t border-gray-200 bg-surface"
    >
      {tabs.map(({ path, label, Icon, dot }) => {
        const active = path === "/" ? pathname === "/" : isInRouteGroup({ pathname, base: path });
        const Tab = active ? ActiveBottomNavTab : BottomNavTab;
        return (
          <Tab
            key={path}
            href={serverPath({ slug, path })}
            label={label}
            Icon={Icon}
            dot={dot && dots[dot.key] ? dot.label : undefined}
          />
        );
      })}
    </Grid>
  );
}
