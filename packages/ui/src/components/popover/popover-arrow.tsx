"use client";

import { Popover as BasePopover } from "@base-ui-components/react/popover";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export function PopoverArrow({
  className,
  ...props
}: ComponentPropsWithRef<typeof BasePopover.Arrow>) {
  return (
    <BasePopover.Arrow
      data-slot="popover-arrow"
      className={(state) =>
        cn(
          "size-2 rotate-45 border-r border-b border-gray-200 bg-surface data-[side=bottom]:-mt-100 data-[side=top]:-mb-100",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
