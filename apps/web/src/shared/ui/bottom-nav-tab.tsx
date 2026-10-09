"use client";

import { cn } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";
import { NavIcon } from "./nav-icon";

export interface BottomNavTabProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  // 점의 이름. 없으면 점을 그리지 않는다.
  dot?: string;
}

export function BottomNavTab({ href, label, Icon, dot }: BottomNavTabProps) {
  return (
    <Link href={href} aria-label={label} className={cn(BOTTOM_NAV_TAB_CLASS, "text-hint")}>
      <NavIcon Icon={Icon} dot={dot} />
    </Link>
  );
}
