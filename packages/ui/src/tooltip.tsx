"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateClassName } from "./state-props";
import { TooltipPopoverFallback } from "./tooltip-popover-fallback";
import { useHoverNone } from "./use-hover-none";

export interface TooltipProps {
  content: ReactNode;
  // 열린 모습을 그대로 보여 줘야 하는 자리(문서·미리보기)를 위해 열어 둔다.
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  // rendered as-is (no wrapper button) so it can sit inside links
  children: ReactElement<Record<string, unknown>>;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: StateClassName<BaseTooltip.Popup.State>;
}

// 툴팁 내용은 aria-describedby로만 전해진다. 꼭 읽어야 하는 정보는 툴팁에 넣지 않는다.
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 300,
  className,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  const hoverNone = useHoverNone();

  if (hoverNone) {
    return (
      <TooltipPopoverFallback
        content={content}
        side={side}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        className={typeof className === "function" ? undefined : className}
      >
        {children}
      </TooltipPopoverFallback>
    );
  }

  return (
    <BaseTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseTooltip.Trigger render={children} delay={delay} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-(--rc-z-popover)">
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
