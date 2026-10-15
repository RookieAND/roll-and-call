import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AdminHeader, MobileRouteTabs } from "@/shared/ui";

import { DISCORD_NAV_ITEMS, type DiscordHref } from "../../model/discord-nav-items";

interface MobileDiscordFrameProps {
  active: DiscordHref;
  children: ReactNode;
}

export function MobileDiscordFrame({ active, children }: MobileDiscordFrameProps) {
  return (
    <>
      <AdminHeader title="Discord" />
      <MobileRouteTabs label="Discord 구역" items={[...DISCORD_NAV_ITEMS]} value={active} />
      <VStack className="min-w-0 flex-1">{children}</VStack>
    </>
  );
}
