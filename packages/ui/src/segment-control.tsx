import { useRender } from "@base-ui-components/react/use-render";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateProps } from "./state-props";

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
        true: "font-bold shadow-sm",
        false: "font-semibold text-gray-600 enabled:hover:text-gray-900 disabled:text-hint",
      },
      // 고른 칸의 색. 참석·불참처럼 답 자체가 뜻을 가질 때만 준다.
      tone: { neutral: "", success: "", danger: "" },
      fill: { true: "flex-1", false: "" },
    },
    compoundVariants: [
      { selected: true, tone: "neutral", className: "bg-surface text-gray-900" },
      { selected: true, tone: "success", className: "bg-success-100 text-success-700" },
      { selected: true, tone: "danger", className: "bg-danger-100 text-danger-600" },
    ],
    defaultVariants: { shape: "label", selected: false, tone: "neutral", fill: false },
  },
);

export type SegmentOption<Value extends string> = {
  value: Value;
  label: string;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "danger";
};

type SegmentControlState = { value: string; disabled: boolean };

export type SegmentControlProps<Value extends string> = StateProps<SegmentControlState> & {
  options: readonly SegmentOption<Value>[];
  value: Value;
  onChange: (value: Value) => void;
  "aria-label": string;
  // 칸이 컨테이너 너비를 나눠 갖는다. 너비는 className으로 준다.
  fill?: boolean;
  // 확정된 값을 읽기만 할 때.
  disabled?: boolean;
};

export function SegmentControl<Value extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
  style,
  render,
  fill = false,
  disabled = false,
}: SegmentControlProps<Value>) {
  const state = { value, disabled };
  return useRender({
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "segment-control",
      role: "radiogroup",
      "aria-label": ariaLabel,
      className: cn(
        "inline-flex gap-050 rounded-400 bg-gray-100 p-050",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      children: options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            data-slot="segment-control-item"
            data-state={selected ? "checked" : "unchecked"}
            data-disabled={disabled ? "" : undefined}
            aria-checked={selected}
            aria-label={option.icon ? option.label : undefined}
            title={option.icon ? option.label : undefined}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={segment({
              shape: option.icon ? "icon" : "label",
              selected,
              tone: option.tone,
              fill,
            })}
          >
            {option.icon ?? option.label}
          </button>
        );
      }),
    },
  });
}
