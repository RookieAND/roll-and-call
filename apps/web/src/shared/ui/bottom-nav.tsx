"use client";

import { cn } from "@trpg/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/games", label: "구인 목록", kind: "list" as const },
  { href: "/me", label: "마이페이지", kind: "profile" as const },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 grid h-[58px] grid-cols-2 border-t border-gray-200 bg-surface text-[10.5px] font-bold">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 transition-colors",
              active ? "text-primary-600" : "text-gray-400",
            )}
          >
            <span className="flex h-3.5 items-center" aria-hidden>
              {tab.kind === "list" ? (
                <span className="h-0.5 w-4 rounded-sm bg-current shadow-[0_-5px_0_currentColor,0_5px_0_currentColor]" />
              ) : (
                <span className="h-3 w-3 rounded-full border-2 border-current" />
              )}
            </span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
