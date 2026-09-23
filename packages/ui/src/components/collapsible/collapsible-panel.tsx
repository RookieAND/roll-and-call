"use client";

import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export type CollapsiblePanelProps = ComponentPropsWithRef<typeof BaseCollapsible.Panel>;

// Base UI가 여닫을 때 --collapsible-panel-height를 재 주므로 높이만 옮겨 부드럽게 연다.
export function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  return (
    <BaseCollapsible.Panel
      data-slot="collapsible-panel"
      className={(state) =>
        cn(
          "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
