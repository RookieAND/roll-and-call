"use client";

import { cn, Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { BottomNavTabProps } from "./bottom-nav-tab";
import { NavIcon } from "./nav-icon";

interface DesktopNavItemProps extends BottomNavTabProps {
  active: boolean;
  disabled: boolean;
}

// 현재 항목은 연한 면 + 왼쪽 막대. 체험 중에는 흐리게 두고 누를 수 없다.
export function DesktopNavItem({ href, label, Icon, dot, active, disabled }: DesktopNavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cn(
        "relative flex min-h-11 items-center gap-150 rounded-500 px-150 outline-none transition-[filter] hover:brightness-[.96] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink",
        active ? "bg-tinted-bg text-tinted-ink" : "text-gray-600",
        disabled && "pointer-events-none",
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute inset-y-[10px] left-0 w-[3px] rounded-full bg-tinted-ink"
        />
      )}
      <NavIcon Icon={Icon} dot={dot} size={22} />
      <Text typography="body2" weight={active ? "bold" : "medium"} foreground="inherit">
        {label}
      </Text>
    </Link>
  );
}
