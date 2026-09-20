import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const badge = cva(
  "inline-flex items-center rounded-[7px] px-[9px] py-[5px] text-[12px] font-bold leading-none",
  {
    variants: {
      color: {
        gray: "bg-gray-100 text-gray-600",
        // primary-700은 다크에서 뒤집히지 않아 남색 위 남색이 된다. 틴트 배경 글씨는 tinted-ink가 맡는다.
        primary: "bg-primary-50 text-tinted-ink",
        success: "bg-success-100 text-success-700",
        danger: "bg-danger-100 text-danger-600",
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
