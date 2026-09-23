"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export type TabsIndicatorProps = ComponentPropsWithRef<typeof BaseTabs.Indicator>;

export function TabsIndicator({ className, ...props }: TabsIndicatorProps) {
  return (
    <BaseTabs.Indicator
      data-slot="tabs-indicator"
      className={(state) =>
        cn(
          "absolute bottom-0 left-0 h-[2px] [[data-variant=solid]_&]:hidden w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary-600 transition-[translate,width] duration-(--rc-duration-fast) ease-(--rc-ease-out)",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
