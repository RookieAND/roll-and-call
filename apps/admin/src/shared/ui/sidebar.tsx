import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import Image from "next/image";

import { STAFF_ROLE_LABEL, serverPath } from "@/shared/lib";

import { NAV_ITEMS, PLATFORM_NAV_ITEMS, type NavKey } from "./nav-items";
import { ServerSwitch, type SwitchServer } from "./server-switch";
import { SidebarLauncher } from "./sidebar-launcher";
import { SidebarLink } from "./sidebar-link";

interface SidebarProps {
  nickname: string;
  role: keyof typeof STAFF_ROLE_LABEL;
  platformAdmin: boolean;
  server: SwitchServer;
  servers: SwitchServer[];
  countPromises: Partial<Record<NavKey, Promise<number | undefined>>>;
  // 플랫폼 메뉴(전역 데이터)를 보는 중이면 서버 메뉴를 흐리게 둔다.
  platformActive?: boolean;
}

export function Sidebar({
  nickname,
  role,
  platformAdmin,
  server,
  servers,
  countPromises,
  platformActive,
}: SidebarProps) {
  const roleLabel = platformAdmin ? "플랫폼 관리자" : `${server.name} ${STAFF_ROLE_LABEL[role]}`;
  const emphasizedRole = platformAdmin || role === "owner";
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
      <ServerSwitch current={server} servers={servers} platformAdmin={platformAdmin} />
      <div className="px-100 pt-125">
        <SidebarLauncher />
      </div>
      <VStack
        gap="025"
        render={<nav aria-label={`${server.name} 메뉴`} />}
        className={cn("p-100", platformActive && "opacity-50")}
      >
        {NAV_ITEMS.filter((item) => role === "owner" || !("ownerOnly" in item)).map((item) => (
          <SidebarLink
            key={item.key}
            href={serverPath({ slug: server.slug, path: item.href })}
            exact={item.href === "/"}
            label={item.label}
            icon={<item.icon size={16} aria-hidden />}
            countPromise={countPromises[item.key]}
          />
        ))}
      </VStack>
      {platformAdmin ? (
        <VStack
          gap="025"
          render={<nav aria-label="플랫폼 메뉴" />}
          className="mt-auto border-t border-gray-200 bg-canvas p-100"
        >
          <HStack align="baseline" gap="075" className="px-125 py-050">
            <Text typography="body4" weight="bold" foreground="muted">
              플랫폼
            </Text>
            <Text typography="body4" foreground="hint">
              모든 서버 공통
            </Text>
          </HStack>
          {PLATFORM_NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.key}
              href={item.href}
              label={item.label}
              icon={<item.icon size={16} aria-hidden />}
            />
          ))}
        </VStack>
      ) : null}
      <HStack
        align="center"
        gap="100"
        className={cn(
          "border-t border-(--rc-color-border-subtle) px-175 py-150",
          !platformAdmin && "mt-auto",
        )}
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
            foreground={emphasizedRole ? "inherit" : "hint"}
            truncate
            className={cn("leading-[1.3]", emphasizedRole && "text-primary-600")}
          >
            {roleLabel}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
