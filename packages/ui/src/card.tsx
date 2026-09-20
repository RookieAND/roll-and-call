import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const card = cva("border border-gray-200", {
  variants: {
    // 상자 종류마다 라디우스가 다르다(디자인 시스템 §C). 카드·프레임이 600, 시트 안 상자가 500.
    radius: { 400: "rounded-400", 500: "rounded-500", 600: "rounded-600" },
    background: { surface: "bg-surface", subtle: "bg-gray-50", none: "" },
    padding: { none: "", sm: "p-150", md: "p-200", lg: "p-300" },
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
  },
  defaultVariants: { radius: 600, background: "surface", padding: "md", interactive: false },
});

export interface CardProps extends ComponentPropsWithRef<"div">, VariantProps<typeof card> {}

export function Card({ radius, background, padding, interactive, className, ...props }: CardProps) {
  return (
    <div className={cn(card({ radius, background, padding, interactive }), className)} {...props} />
  );
}
