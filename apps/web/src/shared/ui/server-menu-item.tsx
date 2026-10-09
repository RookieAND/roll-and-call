"use client";

import { Menu } from "@base-ui-components/react/menu";
import { Text, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { serverJoinPath, serverPath } from "@/shared/lib";

import type { MenuServer } from "./menu-server";
import { RETURNING_HINT } from "./returning-hint";
import { ServerIcon } from "./server-icon";

interface ServerMenuItemProps {
  server: MenuServer;
  checked: boolean;
  destination: "home" | "games" | "join";
}

export function ServerMenuItem({ server, checked, destination }: ServerMenuItemProps) {
  const router = useRouter();
  const weight = checked ? "extrabold" : "medium";
  const href = {
    home: serverPath({ slug: server.slug, path: "/" }),
    games: serverPath({ slug: server.slug, path: "/games" }),
    join: serverJoinPath({ slug: server.slug }),
  }[destination];
  return (
    <Menu.RadioItem
      value={server.slug}
      label={server.name}
      closeOnClick
      onClick={() => router.push(href)}
      className="flex min-h-12 cursor-pointer items-center gap-125 rounded-400 px-125 py-100 outline-none data-checked:bg-tinted-bg data-highlighted:bg-gray-50 data-checked:data-highlighted:bg-tinted-bg-hover"
    >
      <ServerIcon name={server.name} icon={server.icon} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" weight={weight} truncate>
          {server.name}
        </Text>
        {server.returning && (
          <Text typography="body5" foreground="muted" className="text-pretty">
            {RETURNING_HINT}
          </Text>
        )}
      </VStack>
      {!!server.todoCount && (
        <Text typography="body5" weight="bold" foreground="primary" className="flex-none">
          할 일 {server.todoCount}건
        </Text>
      )}
      <Menu.RadioItemIndicator className="flex-none text-tinted-ink">
        <Check size={18} strokeWidth={2.6} aria-hidden />
      </Menu.RadioItemIndicator>
    </Menu.RadioItem>
  );
}
