import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import Image from "next/image";

import { NAV_ITEMS, type NavKey } from "./nav-items";
import { SidebarLink } from "./sidebar-link";

const ROLE_LABEL = { owner: "소유자", staff: "운영진" } as const;

interface SidebarProps {
  nickname: string;
  role: keyof typeof ROLE_LABEL;
  countPromises: Partial<Record<NavKey, Promise<number | undefined>>>;
}

export function Sidebar({ nickname, role, countPromises }: SidebarProps) {
  return (
    <VStack className="sticky top-0 h-dvh w-[212px] shrink-0 border-r border-gray-200 bg-surface">
      <HStack
        align="center"
        gap="100"
        className="border-b border-(--rc-color-border-subtle) px-175 pt-175 pb-150"
      >
        <Image src="/logo_light.png" alt="Roll & Call" width={78} height={19} priority />
        <Text
          typography="body4"
          weight="bold"
          foreground="muted"
          className="rounded-200 border border-gray-200 px-075 py-025"
        >
          ADMIN
        </Text>
      </HStack>
      <HStack
        align="center"
        gap="100"
        className="border-b border-(--rc-color-border-subtle) px-175 py-150"
      >
        <Text
          typography="body4"
          weight="bold"
          foreground="muted"
          aria-hidden
          className="grid size-[28px] shrink-0 place-items-center rounded-full bg-gray-200"
        >
          {nickname.slice(0, 1)}
        </Text>
        <VStack gap="025" className="min-w-0">
          <Text typography="subtitle2" truncate className="leading-[1.25]">
            {nickname}
          </Text>
          <Text
            typography="body4"
            weight="medium"
            foreground={role === "owner" ? "inherit" : "hint"}
            className={cn("leading-[1.3]", role === "owner" && "text-primary-600")}
          >
            {ROLE_LABEL[role]}
          </Text>
        </VStack>
      </HStack>
      <VStack gap="025" render={<nav aria-label="어드민 메뉴" />} className="p-100">
        {NAV_ITEMS.filter((item) => role === "owner" || !("ownerOnly" in item)).map((item) => (
          <SidebarLink
            key={item.key}
            href={item.href}
            label={item.label}
            icon={<item.icon size={16} aria-hidden />}
            countPromise={countPromises[item.key]}
          />
        ))}
      </VStack>
    </VStack>
  );
}
