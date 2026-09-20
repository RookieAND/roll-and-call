import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";

import { cn } from "./cn";

const iconButton = cva(
  "inline-flex items-center justify-center rounded-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-50",
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

export type IconButtonProps = ComponentPropsWithRef<"button"> &
  VariantProps<typeof iconButton> & {
    asChild?: boolean;
  };

export function IconButton({
  variant,
  size,
  className,
  type,
  asChild,
  ref,
  children,
  ...props
}: IconButtonProps) {
  const useAsChild = asChild && isValidElement(children);
  const classes = cn(iconButton({ variant, size }), className);

  return useRender({
    ref,
    defaultTagName: "button",
    render: useAsChild ? (children as ReactElement<Record<string, unknown>>) : undefined,
    props: useAsChild
      ? { className: classes, ...props }
      : { type: type ?? "button", className: classes, children, ...props },
  });
}
