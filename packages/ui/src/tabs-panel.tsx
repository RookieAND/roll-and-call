"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export type TabsPanelProps = ComponentPropsWithRef<typeof BaseTabs.Panel>;

// 내용이 길어 스크롤될 수 있으므로 패널 자체가 포커스를 받는다.
export function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      tabIndex={0}
      className={(state) => cn("pt-150 outline-none", resolveStateProp(className, state))}
      {...props}
    />
  );
}
