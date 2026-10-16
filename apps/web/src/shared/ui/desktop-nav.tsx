"use client";

import { Avatar, HStack, Text, VStack } from "@roll-and-call/ui";
import { isNumber } from "es-toolkit";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useNavBadges } from "@/shared/api";
import { serverPath } from "@/shared/lib";

import { BrandLogo } from "./brand-logo";
import { DesktopNavItem } from "./desktop-nav-item";
import { DesktopNavServer } from "./desktop-nav-server";
import type { MenuServer } from "./menu-server";
import { isNavTabActive, NAV_TABS } from "./nav-tabs";

interface DesktopNavProps {
  current: MenuServer;
  servers?: MenuServer[];
  memberCount?: number;
  profile?: { name: string; avatar: string | null; role: string };
  // 도움말 아래 로그아웃 버튼. 로그인한 사람에게만 넘긴다.
  signOut?: ReactNode;
}

// 1100px 이상에서만 보이는 좌측 내비(224px). 모바일 하단 탭과 같은 메뉴·점을 쓴다.
export function DesktopNav({
  current,
  servers = [],
  memberCount,
  profile,
  signOut,
}: DesktopNavProps) {
  const badges = useNavBadges();
  const serverHome = serverPath({ slug: current.slug, path: "/" });
  const pathname = usePathname();
  const relative = pathname.slice(serverHome.length) || "/";
  const inTrial = pathname.startsWith(`/${current.slug}/onboarding`);

  return (
    <nav
      aria-label="주요 메뉴"
      aria-disabled={inTrial || undefined}
      className="fixed inset-y-0 left-0 z-(--rc-z-sticky) hidden w-56 flex-col border-r border-gray-200 bg-surface desktop:flex"
    >
      <HStack
        align="center"
        className="h-(--rc-size-appbar) flex-none border-b border-gray-200 px-200"
      >
        <Link
          href={serverHome}
          className="focus-visible:outline-2 focus-visible:outline-tinted-ink"
        >
          <BrandLogo label="롤앤콜" />
        </Link>
      </HStack>
      <div className={inTrial ? "flex flex-1 flex-col opacity-50" : "flex flex-1 flex-col"}>
        <div className="p-150">
          <DesktopNavServer current={current} servers={servers} memberCount={memberCount} />
        </div>
        <ul className="flex flex-col gap-050 px-150">
          {NAV_TABS.map(({ path, label, Icon, dot }) => {
            const badge = dot ? badges?.dots[dot.key] : false;
            return (
              <li key={path}>
                <DesktopNavItem
                  href={serverPath({ slug: current.slug, path })}
                  label={label}
                  Icon={Icon}
                  dot={dot && badge ? dot.label : undefined}
                  count={isNumber(badge) ? badge : undefined}
                  active={isNavTabActive({ pathname: relative, path })}
                  disabled={inTrial}
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex flex-col gap-050 border-t border-gray-200 p-150">
          <Link
            href={`/help?from=${current.slug}`}
            className="flex min-h-11 items-center gap-150 rounded-500 px-150 text-gray-600 hover:brightness-[.96] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink"
          >
            <CircleHelp size={22} strokeWidth={1.9} aria-hidden />
            <Text typography="body2" weight="medium" foreground="inherit">
              도움말
            </Text>
          </Link>
          {signOut}
          {profile && (
            <HStack align="center" gap="125" className="min-h-11 px-150">
              <Avatar src={profile.avatar} name={profile.name} size="md" />
              <VStack className="min-w-0">
                <Text typography="heading3" weight="bold" className="truncate">
                  {profile.name}
                </Text>
                <Text typography="body4" foreground="hint" className="truncate">
                  {profile.role}
                </Text>
              </VStack>
            </HStack>
          )}
        </div>
      </div>
    </nav>
  );
}
