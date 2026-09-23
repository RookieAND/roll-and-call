"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

// 넘치면 가로로 스크롤하고 잘린 쪽을 페이드로 알린다.
const list = cva("relative flex items-stretch", {
  variants: {
    variant: { line: "border-b border-gray-200", solid: "gap-050 rounded-400 bg-gray-100 p-050" },
    scrollable: {
      true: "overflow-x-auto [scrollbar-width:none] [mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-16px),transparent)]",
      false: "",
    },
  },
  defaultVariants: { variant: "line", scrollable: true },
});

export interface TabsListProps
  extends ComponentPropsWithRef<typeof BaseTabs.List>, VariantProps<typeof list> {}

export function TabsList({
  variant = "line",
  scrollable = true,
  className,
  ...props
}: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-variant={variant ?? undefined}
      className={(state) => cn(list({ variant, scrollable }), resolveStateProp(className, state))}
      {...props}
    />
  );
}
