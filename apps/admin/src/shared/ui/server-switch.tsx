"use client";

import { Button, cn, HStack, Popover, Text, VStack } from "@roll-and-call/ui";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";

import { serverSwitchMeta, type STAFF_ROLE_LABEL } from "@/shared/lib";

import { MobileDrawerContext } from "./mobile/mobile-drawer-context";
import { useDesktop } from "./mobile/use-desktop";
import { ServerIcon } from "./server-icon";
import { ServerSummary } from "./server-summary";
import { Tag } from "./tag";

// 스위처 목록에 보일 서버. 플랫폼 관리자는 전체 서버 중 앞의 몇 개만 보이고 나머지는 서버 목록 화면에서 찾는다.
export interface SwitchServer {
  slug: string;
  name: string;
  icon: string | null;
  role: keyof typeof STAFF_ROLE_LABEL;
  botConnected: boolean;
  pending: number;
}

const PLATFORM_LIST_SIZE = 5;

interface ServerSwitchProps {
  current: SwitchServer;
  servers: SwitchServer[];
  platformAdmin: boolean;
}

export function ServerSwitch({ current, servers, platformAdmin }: ServerSwitchProps) {
  const [open, setOpen] = useState(false);
  const desktop = useDesktop();
  const { openServerSwitch } = useContext(MobileDrawerContext);
  const multiple = servers.length > 1;
  const listed = platformAdmin ? servers.slice(0, PLATFORM_LIST_SIZE) : servers;
  const summary = <ServerSummary server={current} />;

  if (!multiple) {
    return (
      <div className="border-b border-(--rc-color-border-subtle) p-100">
        <HStack
          align="center"
          aria-label={`현재 서버: ${current.name}`}
          className="min-h-[44px] px-100 py-075"
        >
          {summary}
        </HStack>
      </div>
    );
  }

  const triggerClassName = cn(
    "flex min-h-11 w-full items-center gap-100 rounded-400 border px-100 py-075",
    open
      ? "border-(--rc-color-border-primary) bg-tinted-bg"
      : "border-transparent hover:bg-gray-50",
  );

  // 모바일 드로어 안에서는 목록을 팝오버 대신 아래에서 올라오는 시트로 연다.
  if (!desktop) {
    return (
      <div className="border-b border-(--rc-color-border-subtle) p-100">
        {/* ponytail: 데스크톱 팝오버 트리거와 같은 모양을 쓰는 시안 전용 트리거다. */}
        <button
          type="button"
          aria-label={`현재 서버: ${current.name}`}
          onClick={openServerSwitch}
          className={cn(triggerClassName, "active:bg-gray-50")}
        >
          {summary}
          <ChevronDown size={16} aria-hidden className="text-gray-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="border-b border-(--rc-color-border-subtle) p-100">
      <Popover.Root open={open} onOpenChange={setOpen}>
        {/* ponytail: 서버 이름·slug 두 줄과 ▾를 담는 시안 전용 트리거라 Button 대신 Trigger에 직접 모양을 준다. */}
        <Popover.Trigger aria-label={`현재 서버: ${current.name}`} className={triggerClassName}>
          {summary}
          <ChevronDown size={16} aria-hidden className="text-gray-600" />
        </Popover.Trigger>
        <Popover.Popup align="start" sideOffset={4} className="w-[312px] p-075">
          <VStack gap="025" role="menu" aria-label="서버 전환">
            <Text
              typography="body4"
              weight="bold"
              foreground="hint"
              className="px-100 pt-075 pb-050"
            >
              {platformAdmin ? "서버 전환 · 플랫폼 관리자" : "내가 운영하는 서버"}
            </Text>
            {listed.map((server) => {
              const selected = server.slug === current.slug;
              const meta = serverSwitchMeta({ ...server, platformAdmin });
              return (
                <HStack
                  key={server.slug}
                  align="center"
                  gap="100"
                  role="menuitemradio"
                  aria-checked={selected}
                  render={<Link href={`/${server.slug}`} onClick={() => setOpen(false)} />}
                  className={cn(
                    "min-h-[44px] rounded-400 px-100 py-075",
                    selected ? "bg-tinted-bg" : "hover:bg-gray-50",
                  )}
                >
                  <ServerIcon name={server.name} icon={server.icon} size={28} />
                  <VStack className="min-w-0 flex-1">
                    <Text typography="body3" weight="bold" truncate className="leading-[1.3]">
                      {server.name}
                    </Text>
                    <Text typography="body4" foreground="hint" numeric className="leading-[1.3]">
                      {meta}
                    </Text>
                  </VStack>
                  {server.botConnected ? null : <Tag>봇 연결 끊김</Tag>}
                  {selected ? (
                    <Check size={16} aria-hidden className="text-(--rc-color-fg-primary)" />
                  ) : null}
                </HStack>
              );
            })}
            <div role="separator" className="-mx-075 my-050 h-px bg-gray-200" />
            <Button
              role="menuitem"
              variant="ghost"
              colorPalette="gray"
              size="sm"
              render={
                <Link href={platformAdmin ? "/?all=1" : "/"} onClick={() => setOpen(false)} />
              }
              className="w-full justify-start"
            >
              {platformAdmin ? "전체 서버 목록에서 찾기" : "서버 목록 화면으로"}
            </Button>
          </VStack>
        </Popover.Popup>
      </Popover.Root>
    </div>
  );
}
