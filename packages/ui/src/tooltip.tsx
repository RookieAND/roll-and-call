"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { cn } from "./cn";

export type TooltipProps = {
  content: ReactNode;
  /** Trigger element. Rendered as-is (no wrapper button), so it can sit inside links. */
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom" | "left" | "right";
  /** ms before opening on hover */
  delay?: number;
  className?: string;
};

// Hover/focus tooltip. The popup is an inverted chip: bg-gray-900 + text-surface flip together in dark mode.
// ponytail: Base UI tooltips don't open on touch; move to Popover if mobile needs tap-to-reveal.
export function Tooltip({ content, children, side = "top", delay = 300, className }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} delay={delay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
          <BaseTooltip.Popup
            className={cn(
              "max-w-64 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-surface shadow-md transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
              className,
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
