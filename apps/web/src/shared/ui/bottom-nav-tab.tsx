"use client";

import { Text } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";
import { NavIcon } from "./nav-icon";

export interface BottomNavTabProps {
  href: string;
  label: string;
  Icon: LucideIcon;
  dot?: boolean;
}

export function BottomNavTab({ href, label, Icon, dot }: BottomNavTabProps) {
  return (
    <Link href={href} className={`${BOTTOM_NAV_TAB_CLASS} text-hint`}>
      <NavIcon Icon={Icon} dot={dot} />
      <Text typography="body4" weight="bold" foreground="inherit" render={<span />}>
        {label}
      </Text>
    </Link>
  );
}
