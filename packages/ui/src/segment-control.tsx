import type { ReactNode } from "react";

import { cn } from "./cn";

export type SegmentOption<Value extends string> = {
  value: Value;
  label: string;
  icon?: ReactNode;
};

export type SegmentControlProps<Value extends string> = {
  options: readonly SegmentOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  "aria-label": string;
  className?: string;
};

export function SegmentControl<Value extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SegmentControlProps<Value>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex gap-[3px] rounded-[10px] bg-gray-100 p-[3px]", className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.icon ? option.label : undefined}
            title={option.icon ? option.label : undefined}
            onClick={() => onChange(option.value)}
            className={cn(
              option.icon
                ? "flex h-[34px] w-11 items-center justify-center"
                : "h-8 px-[11px] text-[12.5px]",
              "rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
              selected
                ? "bg-surface font-bold text-gray-900 shadow-sm"
                : "font-semibold text-gray-600 hover:text-gray-900",
            )}
          >
            {option.icon ?? option.label}
          </button>
        );
      })}
    </div>
  );
}
