import { HStack, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AdminHeader } from "@/shared/ui";

import type { SettingsHref } from "../model/settings-nav-items";
import { SettingsNav } from "./settings-nav";

interface SettingsFrameProps {
  title: string;
  active: SettingsHref;
  children: ReactNode;
}

export function SettingsFrame({ title, active, children }: SettingsFrameProps) {
  return (
    <>
      <AdminHeader title={`설정 · ${title}`} />
      <HStack align="stretch" className="flex-1">
        <SettingsNav active={active} />
        <VStack gap="150" className="min-w-0 flex-1 p-200">
          {children}
        </VStack>
      </HStack>
    </>
  );
}
