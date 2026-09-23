"use client";

import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { cva } from "class-variance-authority";
import { useContext } from "react";

import { cn } from "../../lib/cn";
import { SwitchContext } from "./switch-context";
import { SwitchThumb } from "./switch-thumb";

const track = cva(
  "relative inline-flex shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-checked:bg-primary-600 data-unchecked:bg-gray-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: { size: { sm: "h-5 w-9", md: "h-[26px] w-11" } },
    defaultVariants: { size: "md" },
  },
);

export interface SwitchControlProps {
  className?: string;
}

export function SwitchControl({ className }: SwitchControlProps) {
  const { size, controlProps } = useContext(SwitchContext);
  return (
    <BaseSwitch.Root
      data-slot="switch-control"
      className={cn(track({ size }), className)}
      {...controlProps}
    >
      <SwitchThumb />
    </BaseSwitch.Root>
  );
}
