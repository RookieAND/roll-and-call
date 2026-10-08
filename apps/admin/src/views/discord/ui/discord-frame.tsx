import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AdminHeader, RouteTabs } from "@/shared/ui";

import { DISCORD_NAV_ITEMS, type DiscordHref } from "../model/discord-nav-items";

interface DiscordFrameProps {
  title: string;
  active: DiscordHref;
  actions?: ReactNode;
  children: ReactNode;
}

export function DiscordFrame({ title, active, actions, children }: DiscordFrameProps) {
  return (
    <>
      <AdminHeader
        title={title}
        trail={[{ href: "/discord", label: "Discord" }]}
        actions={actions}
      />
      <RouteTabs label="Discord 구역" items={[...DISCORD_NAV_ITEMS]} value={active} />
      <VStack gap="150" className="min-w-0 flex-1 p-200">
        {children}
      </VStack>
    </>
  );
}
