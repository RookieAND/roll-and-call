import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AdminHeader, MobileRouteTabs } from "@/shared/ui";

import { SETTINGS_NAV_ITEMS, type SettingsHref } from "../../model/settings-nav-items";

interface MobileSettingsFrameProps {
  active: SettingsHref;
  children: ReactNode;
}

export function MobileSettingsFrame({ active, children }: MobileSettingsFrameProps) {
  return (
    <>
      <AdminHeader title="설정" />
      <MobileRouteTabs label="설정 화면" items={[...SETTINGS_NAV_ITEMS]} value={active} />
      <VStack className="min-w-0 flex-1">{children}</VStack>
    </>
  );
}
