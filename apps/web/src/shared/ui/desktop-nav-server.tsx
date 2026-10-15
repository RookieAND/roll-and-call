"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronsUpDown } from "lucide-react";

import type { MenuServer } from "./menu-server";
import { ServerIcon } from "./server-icon";
import { ServerMenu } from "./server-menu";

interface DesktopNavServerProps {
  current: MenuServer;
  servers: MenuServer[];
  memberCount?: number;
}

// 서버 전환 버튼. 옮겨 갈 다른 서버가 없으면 누를 수 없는 이름표다.
export function DesktopNavServer({ current, servers, memberCount }: DesktopNavServerProps) {
  const switchable = servers.some((server) => server.slug !== current.slug);
  const body = (
    <>
      <ServerIcon name={current.name} icon={current.icon} size="md" tone="primary" />
      <VStack className="min-w-0 flex-1 text-left">
        <Text typography="subtitle2" weight="bold" className="truncate">
          {current.name}
        </Text>
        {memberCount !== undefined && (
          <Text typography="body5" foreground="muted">
            멤버 {memberCount.toLocaleString("ko-KR")}명
          </Text>
        )}
      </VStack>
      {switchable && <ChevronsUpDown size={16} aria-hidden className="flex-none text-gray-500" />}
    </>
  );
  const className = "w-full items-center gap-125 rounded-500 border border-gray-200 p-125";
  if (!switchable) return <HStack className={className}>{body}</HStack>;
  return (
    <ServerMenu
      servers={servers}
      checkedSlug={current.slug}
      aboutLink
      trigger={
        <HStack
          render={<button type="button" aria-label={`${current.name}, 다른 서버로 옮기기`} />}
          className={`${className} cursor-pointer outline-none hover:brightness-[.96] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink`}
        >
          {body}
        </HStack>
      }
    />
  );
}
