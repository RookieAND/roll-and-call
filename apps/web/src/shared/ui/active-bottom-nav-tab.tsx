"use client";

import { Text } from "@roll-and-call/ui";
import Link from "next/link";

import type { BottomNavTabProps } from "./bottom-nav-tab";
import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";
import { NavIcon } from "./nav-icon";

export function ActiveBottomNavTab({ href, label, Icon, dot }: BottomNavTabProps) {
  return (
    <Link href={href} aria-current="page" className={`${BOTTOM_NAV_TAB_CLASS} text-tinted-ink`}>
      <NavIcon Icon={Icon} dot={dot} />
      <Text typography="body4" weight="bold" foreground="inherit" render={<span />}>
        {label}
      </Text>
    </Link>
  );
}
