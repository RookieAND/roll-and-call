import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";

import { cn } from "./cn";

const chip = cva(
  "inline-flex items-center justify-center border font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
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
      },
      selected: {
        true: "border-tinted-border bg-tinted-bg text-tinted-ink",
        false: "",
      },
    },
    defaultVariants: { shape: "pill", tone: "interactive", selected: false },
  },
);

export type ChipProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof chip> & {
    asChild?: boolean;
  };

export function Chip({
  shape,
  tone,
  selected,
  className,
  type,
  asChild,
  ref,
  children,
  ...props
}: ChipProps) {
  const useAsChild = asChild && isValidElement(children);
  const classes = cn(chip({ shape, tone, selected }), className);

  return useRender({
    ref,
    defaultTagName: "button",
    render: useAsChild ? (children as ReactElement<Record<string, unknown>>) : undefined,
    props: useAsChild
      ? { className: classes, ...props }
      : { type: type ?? "button", className: classes, children, ...props },
  });
}
