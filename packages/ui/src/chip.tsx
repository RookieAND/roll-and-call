import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";
import { cn } from "./cn";

const chip = cva(
  "inline-flex items-center justify-center border font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      shape: {
        pill: "shrink-0 rounded-full px-[11px] py-1.5 text-[12.5px]",
        block: "flex-1 h-11 rounded-[10px] text-sm",
      },
      selected: {
        true: "border-[#C7C9F0] bg-primary-50 text-primary-700",
        false: "border-gray-200 bg-surface text-gray-600 hover:bg-gray-50",
      },
    },
    defaultVariants: { shape: "pill", selected: false },
  },
);

export type ChipProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof chip> & {
    /** Render the single child element (e.g. a Next Link) as the chip. */
    asChild?: boolean;
  };

export function Chip({
  shape,
  selected,
  className,
  type,
  asChild,
  ref,
  children,
  ...props
}: ChipProps) {
  const useAsChild = asChild && isValidElement(children);
  const classes = cn(chip({ shape, selected }), className);

  return useRender({
    ref,
    defaultTagName: "button",
    render: useAsChild ? (children as ReactElement<Record<string, unknown>>) : undefined,
    props: useAsChild
      ? { className: classes, ...props }
      : { type: type ?? "button", className: classes, children, ...props },
  });
}
