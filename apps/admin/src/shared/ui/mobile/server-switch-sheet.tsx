"use client";

import { Button, cn, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import Link from "next/link";

import { serverSwitchMeta } from "@/shared/lib";

import { ServerIcon } from "../server-icon";
import type { SwitchServer } from "../server-switch";

interface ServerSwitchSheetProps {
  current: SwitchServer;
  servers: SwitchServer[];
  platformAdmin: boolean;
}

// 드로어의 서버 영역을 누르면 여는 시트. 처리 대기가 많은 서버부터 보인다.
export function ServerSwitchSheet({ current, servers, platformAdmin }: ServerSwitchSheetProps) {
  const sorted = servers.toSorted((left, right) => right.pending - left.pending);
  return (
    <VStack gap="050">
      <Sheet.Title className="mb-0 px-050 pb-075 text-heading3">서버 전환</Sheet.Title>
      <VStack gap="050" role="menu" aria-label="서버 전환">
        {sorted.map((server) => {
          const selected = server.slug === current.slug;
          return (
            <HStack
              key={server.slug}
              align="center"
              gap="125"
              role="menuitemradio"
              aria-checked={selected}
              render={<Link href={`/${server.slug}`} />}
              className={cn(
                "min-h-15 rounded-400 px-125 py-075 active:bg-gray-50",
                selected && "bg-tinted-bg active:bg-tinted-bg",
              )}
            >
              <ServerIcon name={server.name} icon={server.icon} size={32} />
              <VStack className="min-w-0 flex-1">
                <Text typography="body2" weight="bold" truncate>
                  {server.name}
                </Text>
                {server.botConnected ? (
                  <Text typography="body4" foreground="hint" numeric truncate>
                    {serverSwitchMeta({ ...server, platformAdmin })}
                  </Text>
                ) : (
                  <Text typography="body4" weight="bold" foreground="danger">
                    봇 연결 끊김
                  </Text>
                )}
              </VStack>
              {selected ? (
                <Check size={20} aria-hidden className="text-(--rc-color-fg-primary)" />
              ) : null}
            </HStack>
          );
        })}
      </VStack>
      <Button
        variant="outline"
        colorPalette="gray"
        render={<Link href={platformAdmin ? "/?all=1" : "/"} />}
        className="mt-100 h-12 w-full"
      >
        {platformAdmin ? "전체 서버 목록에서 찾기" : "서버 목록 화면으로"}
      </Button>
    </VStack>
  );
}
