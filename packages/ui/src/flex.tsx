import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { gapMap, type GapToken } from "./tokens";

const flex = cva("", {
  variants: {
    direction: { row: "flex-row", column: "flex-col" },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: { true: "flex-wrap" },
    inline: { true: "inline-flex", false: "flex" },
  },
  defaultVariants: { direction: "row", inline: false },
});

export interface FlexProps
  extends ComponentPropsWithRef<"div">, Omit<VariantProps<typeof flex>, "inline"> {
  inline?: boolean;
  // 간격만 레시피 밖이다. 토큰 이름을 그대로 클래스에 얹는 정적 맵이라 스캐너가 본다.
  gap?: GapToken;
}

export function Flex({
  className,
  direction,
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
        flex({ direction, align, justify, wrap, inline: inline ?? false }),
        gap !== undefined && gapMap[gap],
        className,
      )}
      {...props}
    />
  );
}

export interface StackProps extends Omit<FlexProps, "direction"> {}
