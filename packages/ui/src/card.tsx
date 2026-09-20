import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const card = cva("rounded-600 border border-gray-200 bg-surface", {
  variants: {
    padding: { none: "", sm: "p-150", md: "p-200", lg: "p-300" },
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
  },
  defaultVariants: { padding: "md", interactive: false },
});

export type CardProps = ComponentPropsWithRef<"div"> & VariantProps<typeof card>;

export function Card({ padding, interactive, className, ...props }: CardProps) {
  return <div className={cn(card({ padding, interactive }), className)} {...props} />;
}
