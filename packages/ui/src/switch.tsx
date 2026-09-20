import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const track = cva(
  "relative inline-flex h-[26px] w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: { checked: { true: "bg-primary-600", false: "bg-gray-300" } },
  },
);

const knob = cva(
  "inline-block size-[22px] rounded-full bg-surface shadow-sm transition-transform",
  {
    variants: { checked: { true: "translate-x-5", false: "translate-x-0.5" } },
  },
);

export interface SwitchProps
  extends Omit<ComponentPropsWithRef<"button">, "onChange" | "value">, VariantProps<typeof track> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, className, ...props }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(track({ checked }), className)}
      {...props}
    >
      <span aria-hidden className={knob({ checked })} />
    </button>
  );
}
