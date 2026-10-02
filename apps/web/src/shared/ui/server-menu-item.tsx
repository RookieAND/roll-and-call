"use client";

import { Menu } from "@base-ui-components/react/menu";
import { Text } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { serverPath } from "@/shared/lib";

import type { MenuServer } from "./menu-server";
import { ServerIcon } from "./server-icon";

interface ServerMenuItemProps {
  server: MenuServer;
  checked: boolean;
}

export function ServerMenuItem({ server, checked }: ServerMenuItemProps) {
  const router = useRouter();
  const weight = checked ? "extrabold" : "medium";
  return (
    <Menu.RadioItem
      value={server.slug}
      label={server.name}
      closeOnClick
      onClick={() => router.push(serverPath({ slug: server.slug, path: "/games" }))}
      className="flex h-12 cursor-pointer items-center gap-125 rounded-400 px-125 outline-none data-[checked]:bg-tinted-bg data-[highlighted]:bg-gray-50 data-[checked]:data-[highlighted]:bg-tinted-bg-hover"
    >
      <ServerIcon name={server.name} icon={server.icon} />
      <Text typography="body3" weight={weight} truncate className="min-w-0 flex-1">
        {server.name}
      </Text>
      <Menu.RadioItemIndicator className="flex-none text-tinted-ink">
        <Check size={18} strokeWidth={2.6} aria-hidden />
      </Menu.RadioItemIndicator>
    </Menu.RadioItem>
  );
}
