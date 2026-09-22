"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export type TabsTriggerProps = ComponentPropsWithRef<typeof BaseTabs.Tab>;

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-trigger"
      className={(state) =>
        cn(
          "min-h-11 shrink-0 px-200 text-sm font-semibold whitespace-nowrap text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-selected:font-bold data-selected:text-gray-900",
          "[[data-variant=line]_&]:border-b-2 [[data-variant=line]_&]:border-transparent",
          "[[data-variant=solid]_&]:rounded-300 [[data-variant=solid]_&]:data-selected:bg-surface [[data-variant=solid]_&]:data-selected:shadow-sm",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
