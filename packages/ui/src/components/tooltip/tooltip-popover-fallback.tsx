"use client";

import type { ReactElement, ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Button } from "../button/button";
import { IconButton } from "../icon-button/icon-button";
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
// 아바타처럼 span을 감싸면 Base UI가 버튼 역할(role·키보드)을 붙이도록 nativeButton을 끈다.
const NATIVE_BUTTON_TYPES: unknown[] = ["button", Button, IconButton];

export function TooltipPopoverFallback({
  content,
  children,
  side,
  className,
  ...rootProps
}: TooltipPopoverFallbackProps) {
  return (
    <Popover.Root {...rootProps}>
      <Popover.Trigger
        render={children}
        nativeButton={NATIVE_BUTTON_TYPES.includes(children.type)}
      />
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
