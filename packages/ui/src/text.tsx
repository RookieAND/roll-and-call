import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "./cn";

const text = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    color: {
      default: "text-gray-900",
      muted: "text-gray-500",
      primary: "text-primary-600",
      danger: "text-red-600",
    },
  },
  defaultVariants: { size: "base", weight: "normal", color: "default" },
});

export type TextProps = ComponentPropsWithRef<"span"> &
  VariantProps<typeof text> & {
    as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3";
  };

export function Text({ as, size, weight, color, className, ...props }: TextProps) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag className={cn(text({ size, weight, color }), className)} {...props} />
  );
}
