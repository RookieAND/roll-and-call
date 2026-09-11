"use client";

import { cn, Text } from "@trpg/ui";
import { List, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/games", label: "구인 목록", Icon: List },
  { href: "/me", label: "마이페이지", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 grid h-[58px] grid-cols-2 border-t border-gray-200 bg-surface">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
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
