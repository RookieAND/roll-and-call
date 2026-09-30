"use client";

import Link from "next/link";

import type { BottomNavTabProps } from "./bottom-nav-tab";
import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";
import { NavIcon } from "./nav-icon";

export function ActiveBottomNavTab({ href, label, Icon, dot }: BottomNavTabProps) {
  return (
    <Link
      href={href}
      aria-current="page"
      aria-label={label}
      className={`${BOTTOM_NAV_TAB_CLASS} text-tinted-ink`}
    >
      <NavIcon Icon={Icon} dot={dot} />
    </Link>
  );
}
