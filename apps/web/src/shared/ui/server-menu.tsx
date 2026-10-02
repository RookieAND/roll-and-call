"use client";

import { Menu } from "@base-ui-components/react/menu";
import { Text } from "@roll-and-call/ui";
import type { ReactElement, RefObject } from "react";

import type { MenuServer } from "./menu-server";
import { ServerMenuItem } from "./server-menu-item";

interface ServerMenuProps {
  servers: MenuServer[];
  checkedSlug: string | null;
  trigger: ReactElement<Record<string, unknown>>;
  // 분할 버튼처럼 트리거보다 넓은 묶음 아래에 같은 폭으로 열 때 준다.
  anchor?: RefObject<HTMLElement | null>;
  align?: "start" | "end";
}

// 소개 페이지 주 버튼의 ▾와 서버 화면 헤더의 서버 전환이 같이 쓴다.
export function ServerMenu({
  servers,
  checkedSlug,
  trigger,
  anchor,
  align = "start",
}: ServerMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger render={trigger} />
      <Menu.Portal>
        <Menu.Positioner
          anchor={anchor}
          align={align}
          sideOffset={8}
          collisionPadding={16}
          className="z-(--rc-z-popover) outline-none"
        >
          <Menu.Popup
            aria-label="서버 고르기"
            className="flex w-[max(var(--anchor-width),260px)] max-w-[calc(100vw-32px)] flex-col rounded-600 border border-gray-200 bg-surface p-075 shadow-[0_16px_40px_rgba(23,23,28,0.16)] outline-none"
          >
            <Menu.RadioGroup value={checkedSlug}>
              <Menu.GroupLabel
                render={<Text typography="body5" weight="bold" foreground="hint" />}
                className="block px-125 pt-100 pb-075"
              >
                최근 방문 순
              </Menu.GroupLabel>
              {servers.map((server) => (
                <ServerMenuItem
                  key={server.slug}
                  server={server}
                  checked={server.slug === checkedSlug}
                />
              ))}
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
