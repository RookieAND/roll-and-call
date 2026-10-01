"use client";

import { cva } from "class-variance-authority";
import { useContext, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { SegmentedControlContext } from "./segmented-control-context";

const item = cva(
  "relative z-(--rc-z-base) inline-flex items-center justify-center gap-075 rounded-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  {
    variants: {
      size: { sm: "h-8 px-150 text-body4", md: "h-11 px-150 text-sm" },
      fullWidth: { true: "flex-1", false: "" },
      selected: {
        true: "font-bold",
        false: "font-semibold text-gray-600 enabled:hover:text-gray-900 disabled:text-hint",
      },
      colorPalette: { gray: "", success: "", danger: "" },
    },
    compoundVariants: [
      { selected: true, colorPalette: "gray", className: "text-gray-900" },
      { selected: true, colorPalette: "success", className: "bg-success-100 text-success-700" },
      { selected: true, colorPalette: "danger", className: "bg-danger-100 text-danger-600" },
    ],
    defaultVariants: { colorPalette: "gray", selected: false },
  },
);

export interface SegmentedControlItemProps {
  value: string;
  disabled?: boolean;
  colorPalette?: "gray" | "success" | "danger";
  "aria-label"?: string;
  className?: string;
  children: ReactNode;
}

export function SegmentedControlItem({
  value,
  disabled,
  colorPalette = "gray",
  className,
  children,
  ...props
}: SegmentedControlItemProps) {
  const control = useContext(SegmentedControlContext);
  const selected = control.value === value;
  return (
    <button
      ref={(element) => control.register(value, element)}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      data-slot="segmented-control-item"
      data-state={selected ? "checked" : "unchecked"}
      disabled={disabled || control.disabled}
      onClick={() => control.setValue(value)}
      className={cn(
        item({ size: control.size, fullWidth: control.fullWidth, selected, colorPalette }),
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
