"use client";

import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import { cva } from "class-variance-authority";
import { useContext } from "react";

import { cn } from "../../lib/cn";
import { SwitchContext } from "./switch-context";

// 켜짐·꺼짐을 색만으로 가르지 않도록 손잡이를 끝까지 옮긴다.
const knob = cva("inline-block rounded-full bg-surface shadow-sm transition-transform", {
  variants: {
    size: {
      sm: "size-4 data-checked:translate-x-4 data-unchecked:translate-x-0.5",
      md: "size-[22px] data-checked:translate-x-5 data-unchecked:translate-x-0.5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SwitchThumbProps {
  className?: string;
}

export function SwitchThumb({ className }: SwitchThumbProps) {
  const { size } = useContext(SwitchContext);
  return <BaseSwitch.Thumb data-slot="switch-thumb" className={cn(knob({ size }), className)} />;
}
