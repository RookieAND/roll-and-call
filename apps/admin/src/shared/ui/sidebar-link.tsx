"use client";

import { HStack, Text, cn } from "@roll-and-call/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  count?: number;
}

export function SidebarLink({ href, label, icon, count }: SidebarLinkProps) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <HStack
      align="center"
      gap="125"
      aria-current={active ? "page" : undefined}
      render={<Link href={href} />}
      className={cn(
        "rounded-400 px-125 py-100 text-gray-600 hover:bg-gray-50",
        active && "bg-tinted-bg text-(--rc-color-fg-primary-strong) hover:bg-tinted-bg",
      )}
    >
      {icon}
      <Text
        typography="body3"
        foreground="inherit"
        weight={active ? "bold" : undefined}
        className={cn("flex-1 leading-[1.5]", !active && "font-medium")}
      >
        {label}
      </Text>
      {count ? (
        <Text
          typography="body4"
          weight="bold"
          foreground="inherit"
          numeric
          className={cn(
            "min-w-[18px] rounded-400 px-075 py-025 text-center",
            active ? "bg-primary-600 text-on-primary" : "bg-gray-200 text-gray-600",
          )}
        >
          {count}
        </Text>
      ) : null}
    </HStack>
  );
}
