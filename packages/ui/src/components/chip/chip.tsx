import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

const chip = cva(
  "inline-flex items-center justify-center border font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      shape: {
        pill: "h-8 shrink-0 rounded-full px-150 text-body4",
        block: "h-11 flex-1 rounded-400 text-sm",
      },
      // 칩의 결. 고를 수 있는 칩은 selected가 이 위를 덮는다(뒤에 오므로 twMerge가 이긴다).
      tone: {
        interactive: "border-gray-200 bg-surface text-gray-600 hover:bg-gray-50",
        neutral: "border-transparent bg-gray-100 text-gray-700",
        outline: "border-gray-200 text-gray-700",
        notice: "border-notice-border bg-notice-bg text-notice-ink",
      },
      selected: {
        true: "border-tinted-border bg-tinted-bg text-tinted-ink",
        false: "",
      },
    },
    defaultVariants: { shape: "pill", tone: "interactive", selected: false },
  },
);

type ChipState = VariantProps<typeof chip> & { disabled: boolean };

export interface ChipProps
  extends StateComponentProps<"button", ChipState>, VariantProps<typeof chip> {}

export function Chip({
  shape = "pill",
  tone = "interactive",
  selected = false,
  className,
  style,
  type,
  disabled = false,
  render,
  ref,
  children,
  ...props
}: ChipProps) {
  const state = { shape, tone, selected, disabled };

  return useRender({
    ref,
    defaultTagName: "button",
    render,
    state,
    props: {
      "data-slot": "chip",
      className: cn(chip({ shape, tone, selected }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...(render ? { disabled: disabled || undefined } : { type: type ?? "button", disabled }),
      ...props,
      children,
    },
  });
}
