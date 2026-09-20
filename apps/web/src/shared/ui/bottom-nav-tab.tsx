"use client";

import { Text } from "@trpg/ui";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { BOTTOM_NAV_TAB_CLASS } from "./bottom-nav-tab-class";

export type BottomNavTabProps = { href: string; label: string; Icon: LucideIcon };

export function BottomNavTab({ href, label, Icon }: BottomNavTabProps) {
  return (
    <Link href={href} className={`${BOTTOM_NAV_TAB_CLASS} text-hint`}>
      <Icon size={18} aria-hidden />
      <Text typography="subtitle2" foreground="hint" render={<span />}>
        {label}
      </Text>
    </Link>
  );
}
