import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { gapMap, type GapToken } from "./tokens";

const grid = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
  },
});

export type GridProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof grid> & { gap?: GapToken };

export function Grid({ className, cols, gap, ...props }: GridProps) {
  return (
    <div className={cn(grid({ cols }), gap !== undefined && gapMap[gap], className)} {...props} />
  );
}
