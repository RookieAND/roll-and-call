"use client";

import { Button, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronDown } from "lucide-react";
import { useContext } from "react";

import { ServerIcon } from "./server-icon";
import { ServerMenu } from "./server-menu";
import { ServerNavContext } from "./server-nav-context";

// 옮겨 갈 다른 서버가 있을 때만 ▾를 단다. 비멤버로 공개 화면을 볼 때도 지금 서버 이름은 보인다.
export function ServerSwitcher() {
  const nav = useContext(ServerNavContext);
  if (isNull(nav)) return null;
  const { current, servers } = nav;
  const switchable = servers.some((server) => server.slug !== current.slug);
  const icon = <ServerIcon name={current.name} icon={current.icon} size="sm" />;

  if (!switchable) {
    return (
      <HStack align="center" gap="075" className="min-w-0">
        {icon}
        <Text typography="subtitle2" truncate>
          {current.name}
        </Text>
      </HStack>
    );
  }
  return (
    <ServerMenu
      servers={servers}
      checkedSlug={current.slug}
      trigger={
        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          aria-label={`${current.name}, 다른 서버로 옮기기`}
          className="min-w-0 shrink gap-075 px-075 text-gray-900"
        >
          {icon}
          <span className="min-w-0 truncate">{current.name}</span>
          <ChevronDown size={14} strokeWidth={2.4} aria-hidden className="flex-none text-hint" />
        </Button>
      }
    />
  );
}
