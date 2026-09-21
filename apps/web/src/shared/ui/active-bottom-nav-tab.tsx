"use client";

import { Text } from "@trpg/ui";
import Link from "next/link";

import type { BottomNavTabProps } from "./bottom-nav-tab";
import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";
import { NavIcon } from "./nav-icon";

export function ActiveBottomNavTab({ href, label, Icon, dot }: BottomNavTabProps) {
  return (
    <Link href={href} aria-current="page" className={`${BOTTOM_NAV_TAB_CLASS} text-primary-ink`}>
      <NavIcon Icon={Icon} dot={dot} />
      <Text typography="subtitle2" foreground="inherit" render={<span />}>
        {label}
      </Text>
    </Link>
  );
}
