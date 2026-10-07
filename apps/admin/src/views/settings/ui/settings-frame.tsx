import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AdminHeader, RouteTabs } from "@/shared/ui";

import { SETTINGS_NAV_ITEMS, type SettingsHref } from "../model/settings-nav-items";

interface SettingsFrameProps {
  title: string;
  active: SettingsHref;
  actions?: ReactNode;
  children: ReactNode;
}

export function SettingsFrame({ title, active, actions, children }: SettingsFrameProps) {
  return (
    <>
      <AdminHeader title={title} trail={[{ href: "/settings", label: "설정" }]} actions={actions} />
      <RouteTabs label="설정 화면" items={[...SETTINGS_NAV_ITEMS]} value={active} />
      <VStack gap="150" className="min-w-0 flex-1 p-200">
        {children}
      </VStack>
    </>
  );
}
