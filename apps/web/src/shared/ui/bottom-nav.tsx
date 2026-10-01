"use client";

import { Grid } from "@roll-and-call/ui";
import { CalendarDays, List, User } from "lucide-react";
import { usePathname } from "next/navigation";

import { serverPath } from "@/shared/lib";

import { ActiveBottomNavTab } from "./active-bottom-nav-tab";
import { BottomNavTab } from "./bottom-nav-tab";
import { isInRouteGroup } from "./is-in-route-group";

const tabs = [
  { path: "/", label: "홈", Icon: CalendarDays },
  { path: "/games", label: "구인 목록", Icon: List },
  { path: "/me", label: "마이페이지", Icon: User },
];

// 몰입 화면(상세·등록·수정·조율 등 하단 CTA가 있는 곳)은 탭을 숨기고 FloatingBar만 남긴다. 서버 slug 뒤의 경로로 본다.
const IMMERSIVE = /^\/games\/(new$|[^/]+)/;

interface BottomNavProps {
  slug: string;
  hasTodo: boolean;
}

export function BottomNav({ slug, hasTodo }: BottomNavProps) {
  const serverHome = serverPath({ slug, path: "/" });
  const pathname = usePathname().slice(serverHome.length) || "/";
  if (IMMERSIVE.test(pathname)) return null;

  return (
    <Grid
      cols={3}
      render={<nav aria-label="주요 메뉴" />}
      className="sticky bottom-0 z-(--rc-z-sticky) h-(--rc-size-tabbar) border-t border-gray-200 bg-surface"
    >
      {tabs.map(({ path, label, Icon }) => {
        const active = path === "/" ? pathname === "/" : isInRouteGroup({ pathname, base: path });
        const Tab = active ? ActiveBottomNavTab : BottomNavTab;
        return (
          <Tab
            key={path}
            href={serverPath({ slug, path })}
            label={label}
            Icon={Icon}
            dot={path === "/me" && hasTodo}
          />
        );
      })}
    </Grid>
  );
}
