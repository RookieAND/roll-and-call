"use client";

import { HStack, Text, cn } from "@roll-and-call/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { SidebarCount } from "./sidebar-count";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  countPromise?: Promise<number | undefined>;
}

export function SidebarLink({ href, label, icon, countPromise }: SidebarLinkProps) {
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
      {countPromise ? (
        <Suspense fallback={null}>
          <SidebarCount countPromise={countPromise} active={active} />
        </Suspense>
      ) : null}
    </HStack>
  );
}
