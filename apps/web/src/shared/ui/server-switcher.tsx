"use client";

import { Badge } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { ChevronDown } from "lucide-react";
import { useContext } from "react";

import type { MenuServer } from "./menu-server";
import { ServerIcon } from "./server-icon";
import { ServerMenu } from "./server-menu";
import { ServerNavContext } from "./server-nav-context";

interface ServerSwitcherProps {
  // 서버 홈만 내 서버 목록을 넘긴다. 옮겨 갈 다른 서버가 있을 때만 ▾를 단다.
  servers?: MenuServer[];
}

export function ServerSwitcher({ servers = [] }: ServerSwitcherProps) {
  const current = useContext(ServerNavContext);
  if (isNull(current)) return null;
  const switchable = servers.some((server) => server.slug !== current.slug);
  if (!switchable) {
    return (
      <Badge colorPalette="primary" className="min-w-0 shrink gap-050 pl-075">
        <ServerIcon name={current.name} icon={current.icon} size="xs" />
        <span className="truncate">{current.name}</span>
      </Badge>
    );
  }
  return (
    <ServerMenu
      servers={servers}
      checkedSlug={current.slug}
      aboutLink
      trigger={
        <Badge
          colorPalette="primary"
          render={<button type="button" aria-label={`${current.name}, 다른 서버로 옮기기`} />}
          className="min-w-0 shrink cursor-pointer gap-050 pl-075 hover:bg-tinted-bg-hover"
        >
          <ServerIcon name={current.name} icon={current.icon} size="xs" />
          <span className="truncate">{current.name}</span>
          <ChevronDown size={14} strokeWidth={2.4} aria-hidden className="flex-none" />
        </Badge>
      }
    />
  );
}
