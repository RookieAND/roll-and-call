import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "./cn";

const badge = cva(
  "inline-flex items-center rounded-[7px] px-[9px] py-[5px] text-[11px] font-bold leading-none",
  {
    variants: {
      color: {
        gray: "bg-gray-100 text-gray-600",
        primary: "bg-primary-50 text-primary-700",
        success: "bg-success-100 text-success-700",
        danger: "bg-red-100 text-red-700",
        discord: "bg-discord text-white",
      },
    },
    defaultVariants: { color: "gray" },
  },
);

export type BadgeProps = ComponentPropsWithRef<"span"> & VariantProps<typeof badge>;

export function Badge({ color, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ color }), className)} {...props} />;
}
