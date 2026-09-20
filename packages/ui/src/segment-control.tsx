import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "./cn";

const segment = cva(
  "rounded-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200",
  {
    variants: {
      // 아이콘은 정사각 터치 영역, 글자는 가로로 눕는 칸이라 치수가 다르다.
      shape: {
        icon: "flex h-[34px] w-11 items-center justify-center",
        label: "h-8 px-150 text-body4",
      },
      selected: {
        true: "bg-surface font-bold text-gray-900 shadow-sm",
        false: "font-semibold text-gray-600 hover:text-gray-900",
      },
    },
    defaultVariants: { shape: "label", selected: false },
  },
);

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
      className={cn("inline-flex gap-050 rounded-400 bg-gray-100 p-050", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          aria-label={option.icon ? option.label : undefined}
          title={option.icon ? option.label : undefined}
          onClick={() => onChange(option.value)}
          className={segment({
            shape: option.icon ? "icon" : "label",
            selected: option.value === value,
          })}
        >
          {option.icon ?? option.label}
        </button>
      ))}
    </div>
  );
}
