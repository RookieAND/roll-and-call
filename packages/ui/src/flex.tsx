import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { gapMap, type GapToken } from "./tokens";

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

export type FlexProps = ComponentPropsWithRef<"div"> & {
  direction?: "row" | "column";
  align?: keyof typeof alignMap;
  justify?: keyof typeof justifyMap;
  gap?: GapToken;
  wrap?: boolean;
  inline?: boolean;
};

export function Flex({
  className,
  direction = "row",
  align,
  justify,
  gap,
  wrap,
  inline,
  ...props
}: FlexProps) {
  return (
    <div
      className={cn(
        inline ? "inline-flex" : "flex",
        direction === "column" ? "flex-col" : "flex-row",
        align && alignMap[align],
        justify && justifyMap[justify],
        gap !== undefined && gapMap[gap],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

export type StackProps = Omit<FlexProps, "direction">;
