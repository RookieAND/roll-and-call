import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

const iconButton = cva(
  "inline-flex items-center justify-center rounded-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid: "bg-primary-600 text-white hover:bg-primary-700",
        ghost: "text-gray-600 hover:bg-gray-100",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      },
      size: { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

type IconButtonState = VariantProps<typeof iconButton> & { disabled: boolean };

export interface IconButtonProps
  extends StateComponentProps<"button", IconButtonState>, VariantProps<typeof iconButton> {}

export function IconButton({
  variant = "ghost",
  size = "md",
  className,
  style,
  type,
  disabled = false,
  render,
  ref,
  children,
  ...props
}: IconButtonProps) {
  const state = { variant, size, disabled };

  return useRender({
    ref,
    defaultTagName: "button",
    render,
    state,
    props: {
      "data-slot": "icon-button",
      className: cn(iconButton({ variant, size }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...(render ? { disabled: disabled || undefined } : { type: type ?? "button", disabled }),
      ...props,
      children,
    },
  });
}
