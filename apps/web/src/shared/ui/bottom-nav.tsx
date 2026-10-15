"use client";

import { Grid } from "@roll-and-call/ui";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import { serverPath } from "@/shared/lib";

import { ActiveBottomNavTab } from "./active-bottom-nav-tab";
import { BottomNavTab } from "./bottom-nav-tab";
import { isNavTabActive, NAV_TABS } from "./nav-tabs";
import { usePublishBottomNavHeight } from "./use-publish-bottom-nav-height";

// 몰입 화면(상세·등록·수정·조율 등 하단 CTA가 있는 곳)과 가입·welcome은 탭을 숨긴다. 서버 slug 뒤의 경로로 본다.
const IMMERSIVE = /^\/(games\/(new$|[^/]+)|join$|welcome$)/;

interface BottomNavProps {
  slug: string;
  dots: { home: boolean; notifications: boolean };
}

export function BottomNav({ slug, dots }: BottomNavProps) {
  const serverHome = serverPath({ slug, path: "/" });
  const pathname = usePathname().slice(serverHome.length) || "/";
  const element = useRef<HTMLDivElement>(null);
  const hidden = IMMERSIVE.test(pathname);
  usePublishBottomNavHeight({ ref: element, hidden });
  if (hidden) return null;

  return (
    <Grid
      ref={element}
      cols={4}
      render={<nav aria-label="주요 메뉴" />}
      className="sticky bottom-0 z-(--rc-z-sticky) h-[calc(var(--rc-size-tabbar)+var(--rc-safe-bottom))] pb-(--rc-safe-bottom) border-t border-gray-200 bg-surface desktop:hidden"
    >
      {NAV_TABS.map(({ path, label, Icon, dot }) => {
        const active = isNavTabActive({ pathname, path });
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
