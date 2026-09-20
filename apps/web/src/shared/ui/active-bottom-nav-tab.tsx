"use client";

import { Text } from "@trpg/ui";
import Link from "next/link";

import type { BottomNavTabProps } from "./bottom-nav-tab";
import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";

export function ActiveBottomNavTab({ href, label, Icon }: BottomNavTabProps) {
  return (
    <Link href={href} aria-current="page" className={`${BOTTOM_NAV_TAB_CLASS} text-primary-600`}>
      <Icon size={18} aria-hidden />
      <Text typography="subtitle2" foreground="primary" render={<span />}>
        {label}
      </Text>
    </Link>
  );
}
