"use client";

import { Popover as BasePopover } from "@base-ui-components/react/popover";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export interface PopoverPopupProps extends ComponentPropsWithRef<typeof BasePopover.Popup> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  // 화면 가장자리에서 이만큼 띄우고, 모자라면 반대쪽으로 뒤집는다.
  collisionPadding?: number;
}

// Portal · Positioner를 알아서 감싸는 기본형.
export function PopoverPopup({
  side = "bottom",
  align = "center",
  sideOffset = 8,
  collisionPadding = 8,
  className,
  ...props
}: PopoverPopupProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className="z-(--rc-z-popover) outline-none"
      >
        <BasePopover.Popup
          data-slot="popover-popup"
          className={(state) =>
            cn(
              "max-w-[min(320px,calc(100vw-2rem))] rounded-500 border border-gray-200 bg-surface p-200 text-body3 text-gray-900 shadow-[0_8px_28px_rgba(23,23,28,0.12)] outline-none",
              resolveStateProp(className, state),
            )
          }
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
