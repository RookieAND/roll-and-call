import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { gapMap, type GapToken } from "./tokens";

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

export type GridProps = ComponentPropsWithRef<"div"> & {
  cols?: keyof typeof colsMap;
  gap?: GapToken;
};

export function Grid({ className, cols, gap, ...props }: GridProps) {
  return (
    <div
      className={cn("grid", cols && colsMap[cols], gap !== undefined && gapMap[gap], className)}
      {...props}
    />
  );
}
