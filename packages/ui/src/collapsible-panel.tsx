"use client";

import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

export interface CollapsiblePanelProps extends Omit<
  ComponentPropsWithRef<typeof BaseCollapsible.Panel>,
  "className"
> {
  className?: string;
}

// Base UI가 여닫을 때 --collapsible-panel-height를 재 주므로 높이만 옮겨 부드럽게 연다.
export function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  return (
    <BaseCollapsible.Panel
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    />
  );
}
