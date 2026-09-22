"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateClassName } from "./state-props";

export interface TooltipProps {
  content: ReactNode;
  // rendered as-is (no wrapper button) so it can sit inside links
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: StateClassName<BaseTooltip.Popup.State>;
}

// ponytail: Base UI tooltips don't open on touch; move to Popover if mobile needs tap-to-reveal.
export function Tooltip({ content, children, side = "top", delay = 300, className }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} delay={delay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
          <BaseTooltip.Popup
            data-slot="tooltip-popup"
            className={(state) =>
              cn(
                "max-w-64 rounded-200 bg-gray-900 px-100 py-050 text-xs font-medium text-surface shadow-md transition-opacity duration-150 motion-reduce:transition-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
                resolveStateProp(className, state),
              )
            }
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
