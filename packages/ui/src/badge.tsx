import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const badge = cva(
  "inline-flex items-center rounded-300 px-125 py-075 text-body4 font-bold leading-none",
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

// color는 span의 옛 HTML 속성과 이름이 겹친다. 뱃지에서 색은 variant 쪽이 맡는다.
export interface BadgeProps
  extends Omit<ComponentPropsWithRef<"span">, "color">, VariantProps<typeof badge> {}

export function Badge({ color, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ color }), className)} {...props} />;
}
