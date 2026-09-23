"use client";

import type { ReactElement, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Popover } from "../popover/popover";

interface TooltipPopoverFallbackProps {
  content: ReactNode;
  children: ReactElement<Record<string, unknown>>;
  side: "top" | "bottom" | "left" | "right";
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// 손가락으로 쓰는 기기에서는 hover가 없어 툴팁에 도달할 수 없다. 탭하면 열리는 Popover로 바꾼다.
export function TooltipPopoverFallback({
  content,
  children,
  side,
  className,
  ...rootProps
}: TooltipPopoverFallbackProps) {
  return (
    <Popover.Root {...rootProps}>
      <Popover.Trigger render={children} />
      <Popover.Popup
        data-slot="tooltip-popup"
        side={side}
        sideOffset={6}
        className={cn("max-w-64 px-150 py-100 text-body4", className)}
      >
        {content}
      </Popover.Popup>
    </Popover.Root>
  );
}
