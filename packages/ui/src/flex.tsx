import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactElement } from "react";

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
  // Text와 같은 문법. 의미 있는 태그가 필요할 때 껍데기 div를 덧대지 않는다.
  render?: ReactElement<Record<string, unknown>>;
}

export function Flex({
  className,
  direction,
  align,
  justify,
  gap,
  wrap,
  inline,
  render,
  ...props
}: FlexProps) {
  return useRender({
    defaultTagName: "div",
    render,
    props: {
      className: cn(
        flex({ direction, align, justify, wrap, inline: inline ?? false }),
        gap !== undefined && gapMap[gap],
        className,
      ),
      ...props,
    },
  });
}

export interface StackProps extends Omit<FlexProps, "direction"> {}
